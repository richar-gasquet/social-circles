import os
import flask
import flask_cors
from flask_session import Session
import auth
import postgres_db as db

app = flask.Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('APP_SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_NAME'] = 'socialcircles_session'
app.config["SESSION_COOKIE_SAMESITE"] = "None" # Allow cookies to be sent in cross-site requests
app.config['SESSION_COOKIE_SECURE'] = True  # Ensure cookies are sent in secure channel (HTTPS)
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent client-side scripts from accessing session cookies
app.config['SESSION_USE_SIGNER'] = True  # Sign session cookies for extra security
Session(app)
REACT_FRONTEND = os.environ.get('REACT_FRONTEND')
flask_cors.CORS(app, supports_credentials=True, resources={r"/*": {"origins": REACT_FRONTEND}})

#----------------------------------------------------------------------

# Routes for authentication

@app.route('/login', methods = ['GET'])
def login():
    return auth.login()

@app.route('/login/callback', methods = ['GET'])
def callback():
    return auth.callback()

@app.route('/logout', methods = ['GET'])
def logout():
    return auth.logout()

@app.route('/authenticate', methods = ['GET'])
def authenticate():
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

# Routes for querying EVENTS data from database

@app.route('/get-available-events', methods = ['GET'])
def get_available_events():
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
def get_registered_events():
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
        
#----------------------------------------------------------------------

# Routes for querying COMMUNITIES data from database

@app.route('/get-available-communities', methods = ['GET'])
def get_available_communities():
    """_summary_

    Returns:
        _type_: _description_
    """
    # Check if user is logged in server-side
    if 'email' in flask.session:
        try:
            # Get available communities
            all_comms_info = db.get_all_communities()
            comms_list = []
            
            # Convert each community into a dict
            for comm in all_comms_info:
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

@app.route('/get-registered-communities', methods = ['GET'])
def get_registered_communities():
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