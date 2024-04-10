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

# User methods

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

# DB HAS TO BE FIXED BEFORE THIS METHOD IS FINISHED SINCE THERES A TYPO

# def get_profile_info(email) -> list:
    # """ Get all information pertaining to user

    # Returns:
    #     list: list containing all events information about the user
    # """
    
    # try: 
    #     with psycopg2.connect(DATABASE_URL) as connection:
    #         with connection.cursor() as cursor: 
    #             # Get all available events' info from event table
    #             cursor.execute('''
    #                 SELECT users.first_name, users.last_name, users.preferred_name
    #                     users.pronouns, users.email, users.phone_num,
    #                     users.address, users.marital_status
    #             ''')
                
    #             events_info = cursor.fetchall()
    #             return events_info
                
    # except Exception as ex:
    #     raise Exception("It seems there was an error getting all"
    #                     + " events. Please contact the administrator.")


#----------------------------------------------------------------------

# Event methods

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
        
#----------------------------------------------------------------------

# Community methods

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
            group_name = args.get('group_name', 'No group name')
            group_desc = args.get('group_desc', 'No group description')
            image_link = args.get('image_link')
            
            cursor.execute('''
                INSERT INTO communities (group_id, group_name,
                    group_desc, member_count, image_link)
                VALUES (DEFAULT, %s, %s, 0, %s)               
            ''', (group_name, group_desc, image_link, ))
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
                vales.append(group_desc)
            if image_link:
                sql_query_base += "image_link = %s "
                values.append(image_link)
            sql_query_base += "WHERE group_id = %s"

            cursor.execute(sql_query_base, tuple(values))
            connection.commit()
    except Exception:
        connection.rollback()
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
                DELETE FROM commmunity
                WHERE group_id = %s
            ''', (comm_id, ))
            connection.commit()
    except Exception:
        connection.rollback()
        raise Exception("It seems there was an error updating the"
                        + " community. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)        
    
#----------------------------------------------------------------------

# Helper functions
