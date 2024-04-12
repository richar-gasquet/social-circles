import os
import flask
import flask_cors
from flask_session import Session
import auth
import postgres_db as db
from dateutil import parser
from datetime import timedelta

app = flask.Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('APP_SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)
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

#----------------------------------------------------------------------

# Routes for querying USER data from database

@app.route('/user-data', methods = ['GET'])
def get_user_data():
    # Check if user is logged on server-side
    if 'email' in flask.session:
        return flask.jsonify({
            'email' : flask.session['email'],
            'name' : flask.session['name']
        }), 200 # ok
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized
        
#----------------------------------------------------------------------

# Routes for requesting EVENTS data from database

@app.route('/get-available-events', methods = ['GET'])
def get_available_events_route():
    """_summary_

    Returns:
        _type_: _description_
    """
    # Check if user is logged in server-side
    if 'email' in flask.session:
        try:
            # Get available events
            all_events_info = db.get_available_events_overviews()
            events_list = []
            
            # Convert each event into a dict
            for event in all_events_info:
                event_dict = {
                    'event_id': event[0],
                    'name': event[1],
                    'desc': event[2],
                    'start_time': event[3],
                    'end_time': event[4],
                    'capacity': event[5],
                    'filled_spots': event[6],
                    'image': event[7],
                }
                events_list.append(event_dict)
                
            return flask.jsonify({
                'status' : 'success',
                'results' : events_list
            }), 200 # ok
        # Catch database error
        except Exception as ex:
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    # Catch unauthenticated user
    else:
        return flask.jsonify({
            'status': 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized
        
@app.route('/get-registered-events', methods = ['GET'])
def get_registered_events_route():
    """_summary_

    Returns:
        _type_: _description_
    """
    # Check if user is logged in server-side
    if 'email' in flask.session:
        try:
            # Get user email and associated registered events
            email = flask.session['email']
            reg_events_info = db.get_registered_events_overviews(email)
            
            # Convert each event into a dict
            events_list = []
            for event in reg_events_info:
                event_dict = {
                    'event_id': event[0],
                    'name': event[1],
                    'desc': event[2],
                    'start_time': event[3],
                    'end_time': event[4],
                    'capacity': event[5],
                    'filled_spots': event[6],
                    'image': event[7],
                }
                events_list.append(event_dict)
                
            return flask.jsonify({
                'status' : 'success',
                'results' : events_list
            }), 200 # ok
        # Catch database error
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    # Catch unauthenticated user
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized

@app.route('/add-event', methods = ['POST'])
def add_event_route():
    if 'email' in flask.session:
        try:
            is_admin = db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("You are not authorized!")
            
            event_data = flask.request.json
            event_dict = {
                'event_name' : event_data['event_name'],
                'capacity' : event_data['capacity'],
                'event_desc' : event_data['event_desc'],
                'image_link' : event_data['image_link'],
                'start_time' : parser.parse(event_data['start_time']),
                'end_time' : parser.parse(event_data['end_time'])
            }
            
            db.add_event(event_dict)
            return flask.jsonify({
                'status' : 'success'
            }), 200 # ok
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized
    
@app.route('/add-event-registration', methods = ['POST'])
def add_event_registration_route():
    # Check if user is logged in server-side
    if 'email' in flask.session:
        try:
            is_admin = db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("You are not authorized!")
            
            return flask.jsonify({
                'status' : 'success'
            }), 200 # ok
        # Catch database error
        except Exception as ex:
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    # Catch authentication error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized
    
@app.route('/delete-event-registration', methods = ['POST'])    
def delete_event_registration_route():
    pass
    
#----------------------------------------------------------------------

# Routes for querying COMMUNITIES data from database

@app.route('/get-available-communities', methods = ['GET'])
def get_available_communities_route():
    """_summary_

    Returns:
        _type_: _description_
    """
    # Check if user is logged in server-side
    if 'email' in flask.session:
        try:
            # Get available communities
            email = flask.session['email']
            all_comms_info = db.get_all_communities(email)
            comms_list = []
            
            # Convert each community into a dict
            for comm in all_comms_info:
                comm_dict = {
                    'group_id' : comm[0],
                    'name' : comm[1],
                    'desc' : comm[2],
                    'count' : comm[3],
                    'image' : comm[4],
                    'isRegistered' : comm[5]
                }
                comms_list.append(comm_dict)
                
            return flask.jsonify({
                'status' : 'success',
                'results' : comms_list
            }), 200 # ok    
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized

@app.route('/get-registered-communities', methods = ['GET'])
def get_registered_communities_route():
    """_summary_

    Returns:
        _type_: _description_
    """
    # Check if user is logged in server-side
    if 'email' in flask.session:
        try:
            # Get user email and associated registered communities
            email = flask.session['email']
            reg_comms_info = db.get_registered_communities(email)
            
            # Convert each event into a dict
            comms_list = []
            for comm in reg_comms_info:
                comm_dict = {
                    'group_id' : comm[0],
                    'name' : comm[1],
                    'desc' : comm[2],
                    'count' : comm[3],
                    'image' : comm[4]
                }
                comms_list.append(comm_dict)
                
            return flask.jsonify({
                'status' : 'success',
                'results' : comms_list
            }), 200 # ok
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized
        
@app.route('/add-community', methods = ['POST'])
def add_community_route():
    if 'email' in flask.session:
        try:
            is_admin = db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("You are not authorized!")
            
            comm_data = flask.request.json
            comm_dict = {
                'group_name' : comm_data['group_name'],
                'group_desc' : comm_data['group_desc'],
                'image_link' : comm_data['image_link'] 
            }
            
            db.add_community(comm_dict)
            return flask.jsonify({
                'status' : 'success'
            }), 200 # ok
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized
        
@app.route('/edit-community', methods = ['POST'])
def edit_community_route():
    if 'email' in flask.session:
        try:
            is_admin = db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("You are not authorized!")
            
            comm_data = flask.request.json
            comm_dict = {
                'group_id' : comm_data.get('group_id', ''),
                'group_name' : comm_data.get('group_name', ''),
                'group_desc' : comm_data.get('group_desc', ''),
                'image_link' : comm_data.get('image_link', '')
            }
            print(comm_dict)
            
            db.update_community(comm_dict)
            return flask.jsonify({
                'status' : 'success'
            })
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized
        
@app.route('/delete-community', methods = ['POST'])
def delete_community_route():
    if 'email' in flask.session:
        try:
            is_admin = db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("You are not authorized!")
            
            comm_data = flask.request.json
            group_id = comm_data['group_id']
            
            db.delete_community(group_id)
            return flask.jsonify({
                'status' : 'success'
            })
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized
        
@app.route('/add-community-registration', methods = ['POST'])
def add_community_registration_route():
    # Check if user is logged in server-side
    if 'email' in flask.session:
        try:
            comm_data = flask.request.json
            group_id = comm_data['group_id']
            
            email = flask.session['email']
            db.add_community_registration(email, group_id)
            
            return flask.jsonify({
                'status' : 'success'
            }), 200 # ok
        # Catch database error
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    # Catch authentication error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized
        
@app.route('/delete-community-registration', methods = ['POST'])
def delete_community_registration_route():
    # Check if user is logged in server-side
    if 'email' in flask.session:
        try:
            comm_data = flask.request.json
            group_id = comm_data['group_id']
            
            print(group_id)
            email = flask.session['email']
            print(email)
            db.delete_community_registration(email, group_id)
            
            return flask.jsonify({
                'status' : 'success'
            }), 200 # ok
        # Catch database error
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    # Catch authentication error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized

@app.route('/get-community-emails', methods = ['POST'])
def email_community_route():
    if 'email' in flask.session:
        try:
            is_admin = db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("You are not authorized!")
            group_id = flask.request.json
            
            emails = db.get_community_emails(int(group_id))
            result = ','.join([email_tuple[0] for email_tuple in emails])
            return flask.jsonify({
                'status' : 'success',
                'results' : result
            }), 200 # ok
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized