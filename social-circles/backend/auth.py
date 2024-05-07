#----------------------------------------------------------------------
# auth.py: Authentication with Google for Social Circles
#----------------------------------------------------------------------

import os
import sys
import json
import requests
from dotenv import load_dotenv
import flask
import oauthlib.oauth2
import user_queries as db

#----------------------------------------------------------------------

# Load in relevant Google IDs/URLs for authentication
load_dotenv()
GOOGLE_DISCOVERY_URL = (
    'https://accounts.google.com/.well-known/openid-configuration'
)

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_ID_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')

REACT_FRONTEND = os.environ.get('REACT_FRONTEND')

# Declare and initialize OAuth2 client
client = oauthlib.oauth2.WebApplicationClient(GOOGLE_CLIENT_ID)

#----------------------------------------------------------------------

def login() -> flask.Response:
    """ Prepares request to redirects the user to Google 'Login' screen

    Returns:
        flask.Response: flask.redirect to Google 'Login'
    """
    # Determine URL for Google login
    google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
    auth_endpoint = (
        google_provider_cfg.get('authorization_endpoint')
    )
    
    # Construct request URL for Google login
    request_uri = client.prepare_request_uri(
        uri = auth_endpoint,
        redirect_uri = flask.request.base_url + '/callback',
        scope = ['email', 'profile', 'openid']
    )
    # Redirect to the request URL for Google Sign in
    return flask.redirect(request_uri)

#----------------------------------------------------------------------
    
def callback() -> flask.Response:
    """ Gets authorization cookie sent and user information sent by Google

    Returns:
        flask.Response: flask.redirect to User/Admin dashboard
    """
    # Get authorization code sent by Google
    auth_code = flask.request.args.get('code')
    
    # Determine URL to fetch tokens to access user's profile data
    google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
    token_endpoint = google_provider_cfg.get('token_endpoint')
    
    # Construct request to fetch tokens
    token_url, headers, body = client.prepare_token_request(
        token_url = token_endpoint,
        authorization_response = flask.request.url,
        redirect_url = flask.request.base_url,
        code = auth_code 
    )
    
    # Fetch tokens from Google
    token_response = requests.post(
        url = token_url,
        headers = headers,
        data = body,
        auth = (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_ID_SECRET)
    )
    
    # Parse tokens from Google as JSON
    client.parse_request_body_response(
        json.dumps(token_response.json())
    )
    
    # Using tokens, fetch the user's profile data 
    userinfo_endpoint = google_provider_cfg.get('userinfo_endpoint')
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers = headers, 
                                     data = body).json()
    
    flask.session['email'] = userinfo_response.get('email')
    flask.session['name'] = userinfo_response.get('name')
    flask.session['picture'] = userinfo_response.get('picture')

    # Check if the user is in the blacklist
    if db.is_in_block(flask.session['email']):
        # Clear session and redirect user to a blocked page or notice
        flask.session.clear()
        return flask.redirect(f'{REACT_FRONTEND}/unauthorized')

    user_details = db.get_user_details(flask.session['email'])
    
    if user_details:
        # If user exists, redirect them to the appropriate dashboard
        if user_details['is_admin']:
            return flask.redirect(f'{REACT_FRONTEND}/admin-dashboard')
        elif user_details['is_admin'] is False:
            return flask.redirect(f'{REACT_FRONTEND}/user-dashboard')
    else:
        # If user does not exists, redirect them to profile creation
        return flask.redirect(f'{REACT_FRONTEND}/profile')
        
#----------------------------------------------------------------------

def logout() -> flask.Response:
    """ Log the user out from the flask session.  

    Returns:
        flask.Response: flask.redirect to landing page
    """
    # Define a set of keys that we want to preserve after logout
    keys_to_preserve = {'session_id', 'visited', 'session_start'}

    # Collect keys that are not in the keys_to_preserve set
    keys_to_delete = [key for key in flask.session.keys() if key not in keys_to_preserve]

    # Delete the keys that are not preserved
    for key in keys_to_delete:
        flask.session.pop(key, None)

    return flask.redirect(f'{REACT_FRONTEND}')

#----------------------------------------------------------------------

def authenticate() -> tuple: 
    """ Authenticates the user against the current flask session

    Returns:
        tuple: JSON containing authentication status and HTML code
    """
    
    # Check if the user has their email stored from logging in
    if 'email' in flask.session:
        if db.is_in_block(flask.session['email']):
            # User is blacklisted; clear the session and return Forbidden
            flask.session.clear()
            return flask.jsonify({'status': 'blocked'}), 403 # Forbidden
        
        is_admin = db.get_user_authorization(flask.session['email'])
        
        # If there's no such user in the database, consider not authenticated
        if not is_admin:
            return flask.jsonify({'status': 'not auth'}), 200 # Unauthorized

        # User has passed all checks, authenticated
        return flask.jsonify({
            'status': 'auth',
            'is_admin': is_admin
        }), 200 # ok
    else: 
        return flask.jsonify({'status': 'not auth'}), 401 # Unauthorized