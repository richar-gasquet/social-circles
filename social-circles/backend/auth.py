import os
import sys
import json
import requests
from dotenv import load_dotenv
import flask
import oauthlib.oauth2

#----------------------------------------------------------------------
# Load in relevant Google IDs/URLs for authentication
load_dotenv()
GOOGLE_DISCOVERY_URL = (
    'https://accounts.google.com/.well-known/openid-configuration'
)

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_ID_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')

# Declare and initialize OAuth2 client
client = oauthlib.oauth2.WebApplicationClient(GOOGLE_CLIENT_ID)

#----------------------------------------------------------------------

def login():
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
    
def callback():
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
    
    # Fetch tokens
    token_response = requests.post(
        url = token_url,
        headers = headers,
        data = body,
        auth = (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_ID_SECRET)
    )
    
    # Parse tokens
    client.parse_request_body_response(
        json.dumps(token_response.json)
    )
    
    # Using tokens, fetch the user's profile data 
    userinfo_endpoint = google_provider_cfg.get('userinfo_endpoint')
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers = headers, 
                                     data = body).json()
    
    flask.session['email'] = userinfo_response.get('email')
    
    return flask.redirect('http://localhost:5173/user-dashboard')
#----------------------------------------------------------------------

def logout():
    flask.session.clear()
    return flask.redirect('http://localhost:5000/')

#----------------------------------------------------------------------

def authenticate():
    if 'email' in flask.session:
        return {'status' : 'auth'}, 200
    return {'status' : 'not auth'}, 401

    