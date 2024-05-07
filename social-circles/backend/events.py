#----------------------------------------------------------------------
# events.py: Flask methods for event-related requests
#----------------------------------------------------------------------

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

#----------------------------------------------------------------------

load_dotenv()

def get_available_events() -> tuple:
    """ Return all available events and user's registration status
        for each one

    Returns:
        tuple: JSON containing events and HTTP code
    """
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Fetch all events from database
            email = flask.session['email']
            all_events = event_db.get_available_events(email)
            events_list = []
            
            # Prepare list of dicts containing all events
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
                
            # Return list of all communities
            return flask.jsonify({
                'results' : events_list
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def get_dana_events() -> tuple:
    """ Return all events in which Dana is participating/hosting 
        and user's registration status for each one 

    Returns:
        tuple: JSON containing events and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Fetch all Dana events from database
            email = flask.session['email']
            dana_events = event_db.get_dana_events(email)
            events_list = []
            
            # Prepare list of dicts containing Dana events
            for event in dana_events:
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
                
            # Return list of Dana events
            return flask.jsonify({
                'results' : events_list
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def get_registered_events() -> tuple:
    """ Return all events the user is registered for

    Returns:
        tuple: JSON containing events and HTTP code
    """
    # Check if the user is authenticated
    if 'email' in flask.session:
        try:
            # Fetch all registered events from database
            email = flask.session['email']
            reg_events = event_db.get_registered_events(email)
            events_list = []
            
            # Prepare list of dicts containing registered events
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
                    'isWaitlisted' : event[11],
                    'inPast' : event[12]
                }
                events_list.append(event_dict)
                
            # Return list of registered events
            return flask.jsonify({
                'results' : events_list
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def get_past_events() -> tuple:
    """ Return all past event

    Returns:
        tuple: JSON containing events and HTTP code
    """
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Fetch all past events from database
            email = flask.session['email']
            past_events = event_db.get_past_events(email)
            events_list = []
            
            # Prepare list of dicts containing past events
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
                    'isDanaEvent' : event[9]
                }
                events_list.append(event_dict)
                
            # Return list of past events
            return flask.jsonify({
                'results' : events_list
            }), 200 # OK
        # Error from database
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
    """ Add an event

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            #Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            # Parse event data to add sent from frontend
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
            
            # Send event data to database for CREATE
            event_db.add_event(event_dict)
            
            # Return success after adding event
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database / not admin
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def edit_event() -> tuple:
    """ Edit an already existing event

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            # Parse event data to be edited sent from frontend
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
                'isDanaEvent' : bool(event_data.get('isDanaEvent', 'unchanged')),
                'start_time' : start_time,
                'end_time' : end_time
            }
            
            # Send event data to database for UPDATE
            event_db.update_event(event_dict)
            
            # Return success after editing community
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from databaase / not admin
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def delete_event() -> tuple:
    """ Delete an event

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            # Parse event data to be deleted sent from frontend
            event_data = flask.request.json
            event_id = event_data.get('event_id')
            
            # Send event data to database for DELETE
            event_db.delete_event(event_id)
                
            # Return success after deleting event
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def add_event_registration() -> tuple:
    """ Add a user to an event's registrations

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Parse event data sent from frontend
            event_data = flask.request.json
            event_id = event_data.get('event_id')
            
            # Get user email
            email = flask.session['email']
            
            # Check if event is full, if so add to waitlist instead
            filled, capacity = event_db.get_event_spots(event_id)
            if filled >= capacity:
                event_db.add_to_waitlist(email, event_id)
                return flask.jsonify({
                    'status' : 'waitlist'
                }), 200 # OK
            # Otherwise, register the user for the event
            else:
                event_db.add_event_registration(email, event_id)
                send_confirmation_email(email, event_id, "registration")
                return flask.jsonify({
                    'status' : 'registered'
                }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def delete_event_registration() -> tuple:
    """ Voluntarily delete a user from an event's registrations

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Parse event data sent from frontend
            event_data = flask.request.json
            event_id = event_data.get('event_id')
            
            # Get user email
            email = flask.session['email']
            
            # Send event ID and user email to database for DELETE 
            event_db.delete_event_registration(email, event_id)
            # Promote first user in the waitlist
            promote_from_waitlist(event_id)
            
            # Return success after removing user from the event and promoting
            # from waitlist
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def delete_event_waitlist() -> tuple:
    """ Voluntarily delete a user from a event's waitlist

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Parse event data sent from frontend
            event_data = flask.request.json
            event_id = event_data.get('event_id')
            
            # Get user email
            email = flask.session['email']
            
            # Send event ID and user email to database for DELETE
            event_db.remove_from_waitlist(email, event_id)
            
            # Return success after removing user from the event's waitlist
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def get_event_emails() -> tuple:
    """ Return all user emails belonging to a particular event

    Returns:
        tuple: JSON containing emails and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            
            # Parse event data sent from frontend
            event_data = flask.request.json
            event_id = event_data.get('event_id')
            
            # Send event data to database for READ
            emails_list = event_db.get_event_emails(event_id)
            
            # Create and return string of user emails
            emails_str = ','.join(email[0] for email in emails_list)
            return flask.jsonify({
                'status' : 'success',
                'results' : emails_str
            }), 200 # OK
        # Error from database / not admin
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
    
def get_event_info() -> tuple:
    """ Return all details for a particular event

    Returns:
        tuple: JSON containing details and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Parse URL parameters to determine which event to fetch for
            event_id = flask.request.args.get('event_id')
            if event_id is None:
                return flask.jsonify({
                    'message' : 'event_id parameter is missing in the URL.'
                }), 400 # BAD REQUEST
                
            # Send event ID to database for READ
            event_info = event_db.get_event_info(event_id, flask.session['email'])

            if not event_info:
                return flask.jsonify({'results' : 'not found'}), 404 # BAD REQUEST

            # Create dict containing event details
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
                'is_full': event_info[12],
                'in_past': event_info[13]
            }
            
            # Return event details
            return flask.jsonify({
                'results' : event_info_dict
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
    
def unregister_user() -> tuple:
    """ Forcefully remove a target user from an event's registrations 

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    # Check if user issuing request is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")            

            # Get event details and target user's email
            event_data = flask.request.json
            event_id = event_data.get('event_id')
            email = event_data.get('email')

            # Send event ID and target user email to database for DELETE
            event_db.delete_event_registration(email, event_id)
            promote_from_waitlist(event_id)
            
            # Return success after removing target user from the event
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'events.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED

def get_users_for_event() -> tuple:
    """ Return all users belonging to a particular event

    Returns:
        tuple: JSON containing all users in an event and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Parse URL parameters to determine which event to fetch for
            event_id = flask.request.args.get('event_id')
            if event_id is None:
                return flask.jsonify({
                    'message' : 'event_id parameter is missing in the URL.'
                }), 400 # BAD REQUEST
                
            # Send event ID to database for READ
            users = event_db.get_users_for_event(event_id)
            
            # Create list of dicts containing users in event
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

            # Return list of all users in the community
            return flask.jsonify({
                'results' : users_list
            }), 200 # OK
        # Error from database
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
    """ Promote user at the top of the waitlist and register them for
        the event

    Args:
        event_id (int): event ID for which the user will be promoted to
    """
    waitlisted_user_email = event_db.get_first_waitlist_user(event_id)
    # Check if a user in the waitlist exists
    if waitlisted_user_email:
        email = waitlisted_user_email
        event_db.add_event_registration(email, event_id)
        event_db.remove_from_waitlist(email, event_id)
        send_confirmation_email(email, event_id, "waitlist_moved")
        
def send_confirmation_email(receiver_email: str, event_id: int, 
                            email_type: str) -> None:
    """ Sends a confirmation email to the given user upon successful
        registration for /promotion to an event

    Args:
        receiver_email (str): Email of user the email will be sent to
        event_id (int): Event ID the email is about
        email_type (str): Whether email is about waitlist or registration
    """
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
    # Create email for event registration
    if email_type == "registration":
        msg['Subject'] = f"[Social Circles] Your Registration is Confirmed for {event_name}."
        body = (
            "Hi there,\n\n"
            f"You have been successfully registered for {event_name}! We look "
            "forward to seeing you there!\n\n"
            "Best,\n"
            "Social Circles Team"
        )
    
    # Create email for event waitlist promotion
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

    # Start local SMTP server and send email
    with smtplib.SMTP_SSL("smtp.gmail.com", port, 
                          context=context) as server:
        server.login(sender, sender_password)

        text = msg.as_string()

        server.sendmail(sender, receiver_email, text)
