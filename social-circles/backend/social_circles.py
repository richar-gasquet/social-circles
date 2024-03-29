import flask
import flask_cors
import auth
import postgres_db as db

app = flask.Flask(__name__)
app.secret_key = 'socialcircles'
flask_cors.CORS(app, supports_credentials=True, origins=['https://localhost:5173'])

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

# Routes for querying EVENT data from database

@app.route('/get-available-events', methods = ['GET'])
def get_available_events():
    # Check if user is logged in server-side
    if 'email' in flask.session:
        try:
            # Get available events
            all_events_info = db.get_available_events()
            events_list = []
            
            # Convert each event into a dict
            for event in all_events_info:
                event_dict = {
                    'event_id': event[0],
                    'event_name': event[1],
                    'date_and_time': event[2],
                    'capacity': event[3],
                    'filled_spots': event[4]
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
    # Catch authentication error
    else:
        return flask.jsonify({
            'status': 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized
        
@app.route('/get-registered-events', methods = ['GET'])
def get_registered_events():
    # Check if user is logged in server-side
    if 'email' in flask.session:
        try:
            # Get user email and associated registered events
            email = flask.session['email']
            registered_events_info = db.get_registered_events(email)
            
            # Convert each event into a dict
            events_list = []
            for events in registered_events_info:
                event_dict = {
                    'event_id': events[0],
                    'event_name': events[1],
                    'date_and_time': events[2],
                    'capacity': events[3],
                    'filled_spots': events[4]
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
    # Catch authentication error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized