import sys
import flask
from dateutil import parser
import event_queries as event_db
import user_queries as user_db

def get_available_events():
    if 'email' in flask.session:
        try:
            email = flask.session['email']
            all_events = event_db.get_available_events(email)
            events_list = []
            
            for event in all_events:
                event_dict = {
                    'event_id': event[0],
                    'name': event[1],
                    'desc': event[2],
                    'start_time': event[3],
                    'end_time': event[4],
                    'capacity': event[5],
                    'filled_spots': event[6],
                    'image': event[7],
                    'isRegistered' : event[8]
                }
                events_list.append(event_dict)
                
            return flask.jsonify({
                'results' : events_list
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def get_registered_events():
    if 'email' in flask.session:
        try:
            email = flask.session['email']
            reg_events = event_db.get_registered_events(email)
            events_list = []
            
            for event in reg_events:
                event_dict = {
                    'event_id': event[0],
                    'name': event[1],
                    'desc': event[2],
                    'start_time': event[3],
                    'end_time': event[4],
                    'capacity': event[5],
                    'filled_spots': event[6],
                    'image': event[7],
                    'isRegistered' : event[8]
                }
                events_list.append(event_dict)
                
            return flask.jsonify({
                'results' : events_list
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def add_event():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            event_data = flask.request.json
            event_dict = {
                'event_name' : event_data['event_name'],
                'capacity' : int(event_data['capacity']),
                'event_desc' : event_data['event_desc'],
                'image_link' : event_data['image_link'],
                'start_time' : parser.parse(event_data['start_time']),
                'end_time' : parser.parse(event_data['end_time'])
            }
            
            event_db.add_event(event_dict)
                
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def edit_event():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            event_data = flask.request.json
            event_dict = {
                'event_id' : event_data.get('event_id', ''),
                'event_name' : event_data.get('event_name', ''),
                'event_desc' : event_data.get('event_desc', ''),
                'image_link' : event_data.get('image_link', ''),
                'event_capacity' : event_data.get('capacity', ''),
                'start_time' : parser.parse(event_data['start_time']),
                'end_time' : parser.parse(event_data['end_time'])
            }
            
            event_db.update_event(event_dict)
                
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def delete_event():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            event_data = flask.request.json
            event_id = event_data.get('group_id')
            
            event_db.delete_event(event_id)
                
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def add_event_registration():
    if 'email' in flask.session:
        try:
            event_data = flask.request.json
            event_id = event_data.get('event_id')
            
            email = flask.session['email']
            
            event_db.add_event_registration(email, event_id)
                
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def delete_event_registration():
    if 'email' in flask.session:
        try:
            event_data = flask.request.json
            event_id = event_data.get('event_id')
            
            email = flask.session['email']
            
            event_db.delete_event_registration(email, event_id)
                
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def get_event_emails():
    print("here")
    if 'email' in flask.session:
        try:
            print("here two")
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            
            event_data = flask.request.json
            event_id = event_data.get('event_id')
            emails_list = event_db.get_event_emails(event_id)
            emails_str = ','.join(email[0] for email in emails_list)
            return flask.jsonify({
                'status' : 'success',
                'results' : emails_str
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED