import sys
import os
import html
import flask
import ssl
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dateutil import parser
from dotenv import load_dotenv
import event_queries as event_db
import user_queries as user_db

load_dotenv()

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
                    'location': event[8],
                    'isDanaEvent' : event[9],
                    'isRegistered' : event[10],
                    'isWaitlisted' : event[11],
                    'isFull' : event[12]
                }
                events_list.append(event_dict)
                
            return flask.jsonify({
                'results' : events_list
            }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
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
                    'location' : event[8],
                    'isDanaEvent' : event[9],
                    'isRegistered' : event[10],
                    'inPast' : event[11]
                }
                events_list.append(event_dict)
                
            return flask.jsonify({
                'results' : events_list
            }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def get_past_events():
    if 'email' in flask.session:
        try:
            email = flask.session['email']
            past_events = event_db.get_past_events(email)
            events_list = []
            
            for event in past_events:
                event_dict = {
                    'event_id': event[0],
                    'name': event[1],
                    'desc': event[2],
                    'start_time': event[3],
                    'end_time': event[4],
                    'capacity': event[5],
                    'filled_spots': event[6],
                    'image' : event[7],
                    'location' : event[8],
                    'isRegistered' : event[9]
                }
                events_list.append(event_dict)
                
            return flask.jsonify({
                'results' : events_list
            }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
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
                'event_name' : html.escape(event_data.get('name')),
                'event_desc' : html.escape(event_data.get('desc')),
                'capacity' : int(event_data.get('capacity')),
                'location' : html.escape(event_data.get('location')),
                'isDanaEvent' : bool(event_data.get('isDanaEvent')),
                'image_link' : html.escape(event_data.get('image')),
                'start_time' : parser.parse(event_data['start_time']),
                'end_time' : parser.parse(event_data['end_time'])
            }
            
            event_db.add_event(event_dict)
                
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
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
            start_time = event_data.get('start_time', '')
            if start_time:
                start_time = parser.parse(start_time).isoformat()
            end_time = event_data.get('end_time', '')
            if end_time:
                end_time = parser.parse(end_time).isoformat()
            
            event_dict = {
                'event_id' : event_data.get('event_id'),
                'event_name' : html.escape(event_data.get('name', '')),
                'event_desc' : html.escape(event_data.get('desc', '')),
                'capacity' : event_data.get('capacity', ''),
                'image_link' : html.escape(event_data.get('image', '')),
                'location' : html.escape(event_data.get('location', '')),
                'isDanaEvent' : bool(event_data.get('isDanaEvent', '')),
                'start_time' : start_time,
                'end_time' : end_time
            }
            
            event_db.update_event(event_dict)
                
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
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
            event_id = event_data.get('event_id')
            
            event_db.delete_event(event_id)
                
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
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
            
            filled, capacity = event_db.get_event_spots(event_id)
            if filled >= capacity:
                event_db.add_to_waitlist(email, event_id)
                return flask.jsonify({
                    'status' : 'waitlist'
                }), 200 # OK
            else:
                event_db.add_event_registration(email, event_id)
                send_confirmation_email(email, event_id, "registration")
                return flask.jsonify({
                    'status' : 'registered'
                }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
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
            promote_from_waitlist(event_id)
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def delete_event_waitlist():
    if 'email' in flask.session:
        try:
            event_data = flask.request.json
            event_id = event_data.get('event_id')
            
            email = flask.session['email']
            
            event_db.remove_from_waitlist(email, event_id)
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def get_event_emails():
    if 'email' in flask.session:
        try:
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
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
    
def get_one_event_info_with_user_status():
    if 'email' in flask.session:
        try:
            event_id = flask.request.args.get('event_id')
            if event_id is None:
                return flask.jsonify({
                    'message' : 'event_id parameter is missing in the URL.'
                }), 400 # BAD REQUEST
            event_info = event_db.get_one_event_info_with_user_status(event_id, flask.session['email'])
            print(event_info)

            event_info_dict = {
                'event_id': event_info[0],
                'event_name': event_info[1],
                'event_desc': event_info[2],
                'start_time': event_info[3],
                'end_time': event_info[4],
                'capacity': event_info[5],
                'filled_spots': event_info[6],
                'image_link': event_info[7],
                'location': event_info[8],
                'is_dana_event': event_info[9],
                'is_registered': event_info[10],
                'is_waitlisted': event_info[11],
                'is_full': event_info[12]
            }

            return flask.jsonify({
                'results' : event_info_dict
            }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
    
def unregister_user():
    if 'email' in flask.session:
        try:
            event_data = flask.request.json
            event_id = event_data.get('event_id')
            email = event_data.get('email')

            event_db.delete_event_registration(email, event_id)
            promote_from_waitlist(event_id)
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED

def get_users_for_event():
    if 'email' in flask.session:
        try:
            event_id = flask.request.args.get('event_id')
            if event_id is None:
                return flask.jsonify({
                    'message' : 'event_id parameter is missing in the URL.'
                }), 400 # BAD REQUEST
            users = event_db.get_users_for_event(event_id)
            users_list = []
            for user in users:
                user_dict = {
                    'user_id' : user[0],
                    'first_name': user[1],
                    'last_name': user[2],
                    'email': user[3],
                    'is_admin': user[4],
                    'address': user[5],
                    'preferred_name': user[6],
                    'pronouns': user[7],
                    'phone_number': user[8],
                    'marital_status': user[9],
                    'family_circumstance': user[10],
                    'community_status': user[11],
                    'interests': user[12],
                    'personal_identity': user[13],
                    'profile_photo': user[14]
                }
                users_list.append(user_dict)

            return flask.jsonify({
                'results' : users_list
            }), 200 # OK
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
# ---------------------------------------------------------------------
# Helper functions for events back-end logic
# ---------------------------------------------------------------------
def promote_from_waitlist(event_id: int) -> None:
    waitlisted_user_email = event_db.get_first_waitlist_user(event_id)
    if waitlisted_user_email:
        email = waitlisted_user_email
        event_db.add_event_registration(email, event_id)
        event_db.remove_from_waitlist(email, event_id)
        send_confirmation_email(email, event_id, "waitlist_moved")
        
def send_confirmation_email(receiver_email: str, event_id: int, 
                            email_type: str) -> None:
    try:
        event_name = event_db.get_event_name(event_id)
    except Exception as ex:
        print(f'events.py: {str(ex)}')
        return
    
    sender = "socialcircles333@gmail.com"
    sender_password = os.environ.get('GOOGLE_PASSWORD')
    
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = receiver_email
    body = ""
    if email_type == "registration":
        msg['Subject'] = f"[Social Circles] Your Registration is Confirmed for {event_name}."
        body = (
            "Hi there,\n\n"
            f"You have been successfully registered for {event_name}! We look "
            "forward to seeing you there!\n\n"
            "Best,\n"
            "Social Circles Team"
        )
    if email_type == "waitlist_moved":
        msg['Subject'] = f"[Social Circles] You've been moved off the waitlist for {event_name}."
        body = (
            "Hi there,\n\n"
            f"You have been successfully moved to the main event for {event_name}! "
            "We look forward to seeing you there!\n\n"
            "Best,\n"
            "Social Circles Team"
        )
        
    msg.attach(MIMEText(body, 'plain'))
    
    context = ssl.create_default_context()
    port = 465
    
    with smtplib.SMTP_SSL("smtp.gmail.com", port, 
                          context=context) as server:
        server.login(sender, sender_password)
        text = msg.as_string()
        server.sendmail(sender, receiver_email, text)
            