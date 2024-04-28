import os
import flask
import flask_cors
from flask_session import Session
from datetime import timedelta
import auth
import users
import events
import communities
import vistors
import resources
import user_queries as db
import uuid
from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler



app = flask.Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('APP_SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
app.config['SESSION_COOKIE_NAME'] = 'socialcircles_session'
app.config["SESSION_COOKIE_SAMESITE"] = "None" # Allow cookies to be sent in cross-site requests
app.config['SESSION_COOKIE_SECURE'] = True  # Ensure cookies are sent in secure channel (HTTPS)
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent client-side scripts from accessing session cookies
app.config['SESSION_USE_SIGNER'] = True  # Sign session cookies for extra security
Session(app)
REACT_FRONTEND = os.environ.get('REACT_FRONTEND')
flask_cors.CORS(app, supports_credentials=True, resources={r"/*": {"origins": REACT_FRONTEND}})

#----------------------------------------------------------------------

# Routes for authentication and authorization

@app.before_request
def make_session_permanent():
    flask.session.permanent = True  # Make the session permanent so that it uses the configured expiration
    flask.session['session_start'] = datetime.now(timezone.utc)
    if 'visited' not in flask.session:
        flask.session['visited'] = True
        flask.session['session_id'] = str(uuid.uuid4())
        vistors.log_visit(flask.session['session_id'])


@app.route('/login', methods = ['GET'])
def login_route():
    return auth.login()

@app.route('/login/callback', methods = ['GET'])
def callback_route():
    return auth.callback()

@app.route('/logout', methods = ['GET'])
def logout_route():
    return auth.logout()

@app.route('/authenticate', methods = ['GET'])
def authenticate_route():
    return auth.authenticate()

app.route('/extend-session', methods = ['POST'])
def session_timeout():
    # Reset the session timeout
    flask.session.modified = True
    return flask.jsonify({'status': 'success', 'message': 'Session extended'})

#----------------------------------------------------------------------

# Routes for querying USER data from database

@app.route('/user-data', methods = ['GET'])
def get_user_data():
    # Check if user is logged on server-side
    if 'email' in flask.session:
        user_details = db.get_user_details(flask.session['email'])
        if user_details:
            return flask.jsonify({
                'first_name' : user_details['first_name'],
                'last_name' : user_details['last_name'],
                'email': user_details['email'],
                'is_admin': user_details['is_admin'],  
                'address' : user_details['address'],
                'preferred_name' : user_details['preferred_name'],
                'pronouns' : user_details['pronouns'],
                'phone_number' : user_details['phone_number'],
                'marital_status' : user_details['marital_status'],
                'family_circumstance' : user_details['family_circumstance'],
                'community_status' : user_details['community_status'],
                'interests' : user_details['interests'],
                'personal_identity' : user_details['personal_identity'],
                'picture' : flask.session['picture']
            }), 200  # OK
        else:
            return flask.jsonify({
                'name': flask.session['name'],
                'email': flask.session['email']
            }), 200  # OK
    else:
        return flask.jsonify({
            'status': 'error',
            'message': 'User not logged in'
        }), 401  # Unauthorized

@app.route('/add-user', methods = ['POST'])
def add_user_data():
    if 'email' in flask.session:
        try:
            user_data = flask.request.json
            user_dict = {
                'first_name': user_data.get('first_name', '')[:50],
                'last_name': user_data.get('last_name', '')[:50],
                'email': user_data.get('email', '')[:50],
                'address': user_data.get('address', '')[:50],
                'preferred_name': user_data.get('preferred_name', '')[:50],
                'pronouns': user_data.get('pronouns', '')[:50],
                'phone_number': user_data.get('phone_number', '')[:15],
                'marital_status': user_data.get('marital_status', '')[:50],
                'family_circumstance': user_data.get('family_circumstance', '')[:50],
                'community_status': user_data.get('community_status', '')[:50],
                'interests': user_data.get('interests', '')[:50],
                'personal_identity': user_data.get('personal_identity', '')[:50]
            }
            db.add_user(user_dict)
            return flask.jsonify({
                'status' : 'success'
            }), 200
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not Auth'
        }), 401 # unauthorized
    

@app.route('/update-user', methods = ['POST'])
def update_user_data():
    if 'email' in flask.session:
        try:
            
            user_data = flask.request.json
            user_dict = {
                'first_name': user_data.get('first_name', '')[:50],
                'last_name': user_data.get('last_name', '')[:50],
                'email': user_data.get('email', '')[:50],
                'address': user_data.get('address', '')[:50],
                'preferred_name': user_data.get('preferred_name', 'N/A')[:50] if user_data.get('preferred_name') != '' else 'N/A',
                'pronouns': user_data.get('pronouns', 'N/A')[:50] if user_data.get('pronouns') != '' else 'N/A',
                'phone_number': user_data.get('phone_number', '')[:15],
                'marital_status': user_data.get('marital_status', 'N/A')[:50] if user_data.get('marital_status') != '' else 'N/A',
                'family_circumstance': user_data.get('family_circumstance', 'N/A')[:50] if user_data.get('family_circumstance') != '' else 'N/A',
                'community_status': user_data.get('community_status', 'N/A')[:50] if user_data.get('community_status') != '' else 'N/A',
                'interests': user_data.get('interests', 'N/A')[:50] if user_data.get('interests') != '' else 'N/A',
                'personal_identity': user_data.get('personal_identity', 'N/A')[:50] if user_data.get('personal_identity') != '' else 'N/A'
            }
            
            db.update_user(user_dict)
            return flask.jsonify({
                'status' : 'success'
            }), 200
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not Auth'
        }), 401 # unauthorized
    
@app.route('/delete-user', methods = ['DELETE'])
def delete_user_data():
    if 'email' in flask.session:
        try:
            user_data = flask.request.json
            db.delete_user(user_data['email'])
            return flask.jsonify({
                'status' : 'success'
            }), 200
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not Auth'
        }), 401 # unauthorized
    
@app.route('/all-users', methods=['GET'])
def get_all_users():
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):  # Check if user is logged in and is authorized
        try:
            all_user_details = db.get_all_user_details()
            return flask.jsonify(all_user_details), 200  # OK
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': 'Failed to fetch user data'
            }), 500  # Internal Server Error
    else:
        return flask.jsonify({
            'status': 'error',
            'message': 'Unauthorized access'
        }), 403  # Forbidden
    
@app.route('/block-and-delete-user', methods=['POST'])
def block_and_delete_user_route():
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):
        # Check if the session user is an admin or has appropriate permissions
        try:
            user_data = flask.request.json
            user_email = user_data['email']  # Email of the user to be blocked and deleted

            db.block_and_delete_user(user_email)
            return flask.jsonify({'status': 'success', 'message': 'User has been blocked and deleted'}), 200
        except Exception as ex:
            return flask.jsonify({'status': 'error', 'message': str(ex)}), 500  # Internal Server Error
    else:
        return flask.jsonify({'status': 'error', 'message': 'Unauthorized access'}), 403  # Forbidden
    

@app.route('/get-blocked-users', methods=['GET'])
def get_blocked_users():
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):
        try:
            blocked_users = db.get_all_blocked_users()
            return flask.jsonify(blocked_users), 200  # OK
        except Exception as ex:
            print(ex)
            return flask.jsonify({'status': 'error', 'message': 'Failed to fetch blocked users'}), 500  # Internal Server Error
    else:
        return flask.jsonify({'status': 'error', 'message': 'Unauthorized access'}), 403  # Forbidden


@app.route('/remove-user-from-block', methods=['POST'])
def remove_user_from_block():
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):
        try:
            user_data = flask.request.json
            db.remove_user_from_block(user_data['email'])
            return flask.jsonify({'status': 'success', 'message': 'User has been removed from the block'}), 200
        except Exception as ex:
            print(ex)
            return flask.jsonify({'status': 'error', 'message': 'Failed to remove user from block'}), 500  # Internal Server Error
    else:
        return flask.jsonify({'status': 'error', 'message': 'Unauthorized access'}), 403  # Forbidden


@app.route('/current_visitors', methods = ['GET'])
def get_current_visitors():
    return vistors.current_visitors()

#----------------------------------------------------------------------

# Routes for requesting EVENTS data from database

@app.route('/get-available-events', methods = ['GET'])
def get_available_events_route():
    return events.get_available_events()
        
@app.route('/get-registered-events', methods = ['GET'])
def get_registered_events_route():
    return events.get_registered_events()

@app.route('/get-past-events', methods = ['GET'])
def get_past_events_route():
    return events.get_past_events()
 
@app.route('/add-event', methods = ['POST'])
def add_event_route():
    return events.add_event()
    
@app.route('/edit-event', methods = ['POST'])
def edit_event_route():
    return events.edit_event()

# Route for deleting an event
@app.route('/delete-event', methods = ['POST'])
def delete_event():
    return events.delete_event()

@app.route('/add-event-registration', methods = ['POST'])
def add_event_registration_route():
    return events.add_event_registration()
    
@app.route('/delete-event-registration', methods = ['POST'])    
def delete_event_registration_route():
    return events.delete_event_registration()

@app.route('/delete-event-waitlist', methods = ['POST'])    
def delete_event_waitlist_route():
    return events.delete_event_waitlist()

@app.route('/unregister-user', methods = ['POST'])    
def unregister_user_route():
    return events.unregister_user()

@app.route('/api/get-one-event-info-with-user-status', methods = ['GET'])
def get_one_event_info():
    return events.get_one_event_info_with_user_status()

@app.route('/api/get-users-for-event', methods = ['GET'])
def get_users_for_event():
    return events.get_users_for_event()

@app.route('/api/get-event-emails', methods = ['POST'])
def email_event_route():
    return events.get_event_emails()

# grab events for calendar
@app.route('/calendar', methods=['GET'])
def calendar_route():
    return events.get_available_events()

#----------------------------------------------------------------------

# Routes for querying COMMUNITIES data from database

@app.route('/api/get-available-communities', methods = ['GET'])
def get_available_communities_route():
    return communities.get_available_communities()

@app.route('/api/get-registered-communities', methods = ['GET'])
def get_registered_communities_route():
    return communities.get_registered_communities()
        
@app.route('/api/add-community', methods = ['POST'])
def add_community_route():
    return communities.add_community()
        
@app.route('/api/edit-community', methods = ['POST'])
def edit_community_route():
    return communities.edit_community()
        
@app.route('/api/delete-community', methods = ['POST'])
def delete_community_route():
    return communities.delete_community()
        
@app.route('/api/add-community-registration', methods = ['POST'])
def add_community_registration_route():
    return communities.add_community_registration()
        
@app.route('/api/delete-community-registration', methods = ['POST'])
def delete_community_registration_route():
    return communities.delete_community_registration()

@app.route('/remove-user', methods = ['POST'])    
def remove_user_route():
    return communities.remove_user()

@app.route('/api/get-one-group-info', methods = ['GET'])
def get_one_group_info():
    return communities.get_one_group_info()

@app.route('/api/get-users-for-group', methods = ['GET'])
def get_users_for_group():
    return communities.get_users_for_group()

@app.route('/api/get-community-emails', methods = ['POST'])
def email_community_route():
    return communities.get_community_emails()

def clear_expired_sessions():
    with app.app_context():
        vistors.delete_expired_sessions_from_database()

scheduler = BackgroundScheduler()
scheduler.add_job(func=clear_expired_sessions, trigger="interval", hours=24)
scheduler.start()

#----------------------------------------------------------------------

# Routes for querying RESOURCES data from database

@app.route('/api/get-resources', methods = ['GET'])
def get_resources_route():
    return resources.get_resources()

@app.route('/api/add-resources', methods = ['POST'])
def add_resources_route():
    return resources.add_resources()

@app.route('/api/delete-resources', methods = ['POST'])
def delete_resources_route():
    return resources.delete_resources()

@app.route('/api/edit-resources', methods = ['POST'])
def update_resources_route():
    return resources.update_resources()