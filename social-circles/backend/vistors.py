import flask
import visitor_queries as vistor_db
import user_queries as user_db


def log_visit(session_id):
    vistor_db.log_visit(session_id)

def current_visitors():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            
            return flask.jsonify(vistor_db.current_visitors()), 200
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



def delete_expired_sessions_from_database():
    vistor_db.delete_expired_sessions_from_database()