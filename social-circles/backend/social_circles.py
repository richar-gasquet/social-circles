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
import users
import user_dashboard
import uuid
from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler



app = flask.Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('APP_SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)
app.config['SESSION_COOKIE_NAME'] = 'socialcircles_session'
app.config["SESSION_COOKIE_SAMESITE"] = "None" # Allow cookies to be sent in cross-site requests
app.config['SESSION_COOKIE_SECURE'] = True  # Ensure cookies are sent in secure channel (HTTPS)
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent client-side scripts from accessing session cookies
app.config['SESSION_USE_SIGNER'] = True  # Sign session cookies for extra security
Session(app)
REACT_FRONTEND = os.environ.get('REACT_FRONTEND')
flask_cors.CORS(app, supports_credentials=True, resources={r"/*": {"origins": REACT_FRONTEND}})

last_session_init_time = None
session_init_lock_timeout = timedelta(seconds=1)  # Timeout to prevent re-init

#----------------------------------------------------------------------

# Routes for authentication and authorization

@app.before_request
def make_session_permanent():
    global last_session_init_time
    now = datetime.now(timezone.utc)

    flask.session.permanent = True  # Make the session permanent so that it uses the configured expiration

    if 'visited' not in flask.session:
        if last_session_init_time is not None and (now - last_session_init_time) < session_init_lock_timeout:
            return  # If the last init was very recent, skip this initialization

        flask.session['session_start'] = now
        flask.session['visited'] = True
        flask.session['session_id'] = str(uuid.uuid4())
        last_session_init_time = now  # Update the last initialization time

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
    return users.get_user_data()

@app.route('/add-user', methods = ['POST'])
def add_user_data():
    return users.add_user_data()
    
@app.route('/update-user', methods = ['POST'])
def update_user_data():
    return users.update_user_data()
    
@app.route('/delete-user', methods = ['DELETE'])
def delete_user_data():
    return users.delete_user_data()
    
@app.route('/all-users', methods=['GET'])
def get_all_users():
    return users.get_all_users()
    
@app.route('/block-and-delete-user', methods=['POST'])
def block_and_delete_user_route():
    return users.block_and_delete_user_route()
    

@app.route('/get-blocked-users', methods=['GET'])
def get_blocked_users():
    return users.get_blocked_users()


@app.route('/remove-user-from-block', methods=['POST'])
def remove_user_from_block():
    return users.remove_user_from_block()

#----------------------------------------------------------------------

# Routes for requesting current vistors from database

@app.route('/current_visitors', methods = ['GET'])
def get_current_visitors():
    return vistors.current_visitors()

#----------------------------------------------------------------------

# Routes for requesting EVENTS data from database

@app.route('/get-available-events', methods = ['GET'])
def get_available_events_route():
    return events.get_available_events()

@app.route('/get-dana-events', methods = ['GET'])
def get_dana_events_route():
    return events.get_dana_events()
        
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

# @app.route('/remove-user', methods = ['POST'])    
# def remove_user_route():
#     return communities.remove_user()

# @app.route('/api/get-one-group-info', methods = ['GET'])
# def get_one_group_info():
#     return communities.get_one_group_info()

# @app.route('/api/get-users-for-group', methods = ['GET'])
# def get_users_for_group():
#     return communities.get_users_for_group()

@app.route('/api/get-community-emails', methods = ['POST'])
def email_community_route():
    return communities.get_community_emails()

def clear_expired_sessions():
    with app.app_context():
        vistors.delete_expired_sessions_from_database()

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

#----------------------------------------------------------------------
# Routes for querying USER DASHBOARD data from database

@app.route('/api/get-announcements', methods = ['GET'])
def get_announcements_route():
    return user_dashboard.get_announcements()

@app.route('/api/add-announcements', methods = ['POST'])
def add_announcements_route():
    return user_dashboard.add_announcements()

@app.route('/api/delete-announcements', methods = ['POST'])
def delete_announcements_route():
    return user_dashboard.delete_announcements()

@app.route('/api/edit-announcements', methods = ['POST'])
def update_announcements_route():
    return user_dashboard.update_announcements()

scheduler = BackgroundScheduler()
scheduler.add_job(func=clear_expired_sessions, trigger="interval", hours=24)
scheduler.start()
