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

@app.route('/get-user-events', methods = ['GET'])
def user_events():
    if 'email' in flask.session:
        try:
            user_email = flask.session['email']
            user_events_info = db.get_available_events(user_email)
            
            events_list = []
            for event in user_events_info:
                event_dict = {
                    'event_id': event[0],
                    'event_name': event[1],
                    'date_and_time': event[2],
                    'capacity': event[3],
                    'filled_sports': event[4]
                }
                events_list.append(event_dict)
                
            return flask.jsonify({
                'status' : 'success',
                'results' : events_list
            }), 200 # ok
        except Exception as ex:
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status': 'error',
            'message': 'User not logged in'
        }), 401 # unauthorized