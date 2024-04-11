import os
import queue
import psycopg2
import json
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.environ.get('DATABASE_URL')

#----------------------------------------------------------------------

# Create Connection Pooling Functionality
_connection_pool = queue.Queue()

def _get_connection():
    try:
        conn = _connection_pool.get(block=False)
    except queue.Empty:
        conn = psycopg2.connect(DATABASE_URL)
    return conn

def _put_connection(conn):
    _connection_pool.put(conn)

#----------------------------------------------------------------------

# Users CRUD

# Get user authorization (regular user / admin)
def get_user_authorization(email: str) -> dict:
    is_admin = False
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT users.is_admin
                FROM users
                WHERE users.email = %s
            ''', (email,))
            authorization_status = cursor.fetchone()
            
            if authorization_status:
                is_admin = authorization_status[0]
    except Exception as ex:
        raise Exception("It seems there was an error getting user data."
                        + " Please contact the administrator.")
    return is_admin

#----------------------------------------------------------------------

# Events CRUD

def get_available_events_overviews() -> list:
    all_events_info = []
    connection = _get_connection()
    try: 
        with connection.cursor() as cursor: 
            # Get all available events' info from event table
            cursor.execute('''
                SELECT DISTINCT events.event_id, events.event_name, 
                        events.event_desc, events.start_time, 
                        events.end_time, events.capacity, 
                        events.filled_spots, events.image_link
                FROM events
            ''')
            
            all_events_info = cursor.fetchall()
    except Exception:
        raise Exception("It seems there was an error getting all"
                        + " events. Please contact the administrator.")
    finally:
        _put_connection(connection)
        
    return all_events_info
        
def get_registered_events_overviews(email: str) -> list:
    registered_events_info = []
    connection = _get_connection()
    try: 
        with connection.cursor() as cursor:
            # Get user results based on their email
            cursor.execute('''
                SELECT user_id
                FROM users
                WHERE users.email = %s
            ''', (email,))    
            user_results = cursor.fetchone()
                                
            # Get userId (index 0 for user's row)
            userId = user_results[0]
            
            # Get events user has registered for
            cursor.execute('''
                SELECT DISTINCT events.event_id, events.event_name, 
                        events.event_desc, events.start_time, 
                        events.end_time, events.capacity, 
                        events.filled_spots, events.image_link
                FROM events
                INNER JOIN event_registrations 
                    ON events.event_id = event_registrations.event_id
                WHERE event_registrations.user_id = %s
            ''', (userId,))
            
            registered_events_info = cursor.fetchall()
    except Exception:
        raise Exception("It seems there was an error getting the events"
                        + " you registered for. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)
        
    return registered_events_info

def add_event(args: dict) -> None:
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            event_name = args.get('event_name')
            capacity = int(args.get('capacity'))
            event_desc = args.get('event_desc')
            image_link = args.get('image_link')
            start_time = args.get('start_time').isoformat()
            end_time = args.get('end_time').isoformat()
            
            values = (event_name, capacity, event_desc, image_link,
                      start_time, end_time)
            
            cursor.execute('''
                INSERT INTO events(event_id, event_name,
                    capacity, filled_spots, event_desc,
                    image_link, start_time, end_time)
                VALUES (DEFAULT, %s, %s, 0, %s, %s, %s, %s);               
            ''', values)
            connection.commit()
    except Exception:
        connection.rollback()
        raise Exception("It seems there was an error creating the"
                        + " community. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)


def register_for_event():
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            pass
    except Exception:
        connection.rollback()
        raise Exception("It seems there was an error in registering the"
                        + " user to this event. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)

def delete_event_registration(user_id, event_id):
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                DELETE FROM event_registrations
                WHERE user_id = %s
                AND event_id = %s
            ''', (user_id, event_id))
            connection.commit()
    except Exception:
        connection.rollback()
        raise Exception("It seems there was an error in registering the"
                        + " user to this event. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)
#----------------------------------------------------------------------

# Communities CRUD

def get_all_communities() -> list:
    all_comms_info = []
    connection = _get_connection()
    try: 
    
        with connection.cursor() as cursor: 
            # Get all available events' info from event table
            cursor.execute('''
                SELECT comm.group_id, comm.group_name, comm.group_desc, 
                    comm.member_count, comm.image_link
                FROM communities comm
            ''')
            
            all_comms_info = cursor.fetchall()
    except Exception:
        raise Exception("It seems there was an error getting all"
                        + " communities. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)
        
    return all_comms_info
        
def get_registered_communities(email) -> list:
    registered_comms_info = []
    connection = _get_connection()
    try: 
        with connection.cursor() as cursor: 
            # Get user results based on their email
            cursor.execute('''
                SELECT user_id
                FROM users
                WHERE users.email = %s
            ''', (email,))    
            user_results = cursor.fetchone()
                                
            # Get userId (index 0 for user's row)
            userId = user_results[0]
            
            # Get communities user is a part of 
            cursor.execute('''
                SELECT comm.group_id, comm.group_name, comm.group_desc, 
                    comm.member_count, comm.image_link
                FROM communities comm
                INNER JOIN community_registrations comm_reg
                    ON comm_reg.group_id = comm.group_id
                WHERE comm_reg.user_id = %s
            ''', (userId,))
            
            registered_comms_info = cursor.fetchall()
    except Exception:
        raise Exception("It seems there was an error getting the"
                        + " communities you are a part of. Please"
                        + " contact the administrator.")
    finally:
        _put_connection(connection)
    
    return registered_comms_info

def add_community(args: dict) -> None:
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            group_name = args.get('group_name')
            group_desc = args.get('group_desc')
            image_link = args.get('image_link')
            
            values = (group_name, group_desc, image_link)
            
            cursor.execute('''
                INSERT INTO communities (group_id, group_name,
                    group_desc, member_count, image_link)
                VALUES (DEFAULT, %s, %s, 0, %s)               
            ''', values)
            connection.commit()
    except Exception:
        connection.rollback()
        raise Exception("It seems there was an error creating the"
                        + " community. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)
    
def update_community(args: dict) -> None:
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            group_id = args.get('group_id')
            group_name = args.get('group_name')
            group_desc = args.get('group_desc')
            image_link = args.get('image_link')
            
            esc_str = 'ESCAPE \'\\\''

            sql_query_base = "UPDATE communities SET "
            values = []
            if group_name:
                sql_query_base += "group_name = %s "
                values.append(group_name)
            if group_desc:
                sql_query_base += "group_desc = %s "
                values.append(group_desc)
            if image_link:
                sql_query_base += "image_link = %s "
                values.append(image_link)
            sql_query_base += "WHERE group_id = %s"
            values.append(group_id)

            cursor.execute(sql_query_base, tuple(values))
            connection.commit()
    except Exception as ex:
        connection.rollback()
        raise ex
        raise Exception("It seems there was an error updating the"
                        + " community. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)
        
def delete_community(comm_id: int) -> None:
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                DELETE FROM communities
                WHERE group_id = %s
            ''', (comm_id, ))
            connection.commit()
    except Exception as ex:
        connection.rollback()
        raise ex
        raise Exception("It seems there was an error updating the"
                        + " community. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)        
    
#----------------------------------------------------------------------

# Helper functions
