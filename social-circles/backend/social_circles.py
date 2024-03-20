import flask
import flask_cors
import auth

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
