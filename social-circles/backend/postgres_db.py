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

def get_user_details(email: str):
    try:
        with psycopg2.connect(os.environ.get('DATABASE_URL')) as connection:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT *
                    FROM users
                    WHERE email = %s
                ''', (email,))
                user_row = cursor.fetchone()
                
                if user_row:
                    return {
                        'first_name' : user_row[1],
                        'last_name' : user_row[2],
                        'email': user_row[3],
                        'is_admin': user_row[4],  
                        'address' : user_row[5],
                        'preferred_name' : user_row[6],
                        'pronouns' : user_row[7],
                        'phone_number' : user_row[8],
                        'marital_status' : user_row[9],
                        'family_circumstance' : user_row[10],
                        'community_status' : user_row[11],
                        'interests' : user_row[12],
                        'personal_identity' : user_row[13]
                    }
    except Exception as ex:
        raise Exception("It seems there was an error getting user data."
                        + " Please contact the administrator.")
    return None

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

def add_user(args: dict):
    try:
        with psycopg2.connect(os.environ.get('DATABASE_URL')) as connection:
            with connection.cursor() as cursor:
                first_name = args.get('first_name')
                last_name = args.get('last_name')
                email = args.get('email')
                address = args.get('address')
                preferred_name = args.get('preferred_name')
                pronouns = args.get('pronouns')
                phone_number = args.get('phone_number')
                marital_status = args.get('marital_status')
                family_circumstance = args.get('family_circumstance')
                community_status = args.get('community_status')
                interests = args.get('interests')
                personal_identity = args.get('personal_identity')
                cursor.execute('''
                    INSERT INTO users (first_name, last_name, email, address, preferred_name, pronouns, phone_number, marital_status, family_circumstance, community_status, interests, personal_identity)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ''', (first_name, last_name, email, address, preferred_name, pronouns, phone_number, marital_status, family_circumstance, community_status, interests, personal_identity))
            connection.commit()
    except Exception as ex:
        raise Exception(f"Error adding user: {ex}. Please contact the administrator.")
    
def update_user(args: dict):
    try:
        with psycopg2.connect(os.environ.get('DATABASE_URL')) as connection:
            with connection.cursor() as cursor:
                first_name = args.get('first_name')
                last_name = args.get('last_name')
                email = args.get('email')
                address = args.get('address')
                preferred_name = args.get('preferred_name')
                pronouns = args.get('pronouns')
                phone_number = args.get('phone_number')
                marital_status = args.get('marital_status')
                family_circumstance = args.get('family_circumstance')
                community_status = args.get('community_status')
                interests = args.get('interests')
                personal_identity = args.get('personal_identity')
                
                # Update SQL query
                cursor.execute('''
                    UPDATE users
                    SET first_name = %s, last_name = %s, address = %s, preferred_name = %s, pronouns = %s, 
                        phone_number = %s, marital_status = %s, family_circumstance = %s, community_status = %s, 
                        interests = %s, personal_identity = %s
                    WHERE email = %s
                ''', (first_name, last_name, address, preferred_name, pronouns, phone_number, marital_status, 
                     family_circumstance, community_status, interests, personal_identity, email))
            connection.commit()
    except Exception as ex:
        raise Exception(f"Error updating user: {ex}. Please contact the administrator.")

def delete_user(email: str):
    try:
        with psycopg2.connect(os.environ.get('DATABASE_URL')) as connection:
            with connection.cursor() as cursor:
                # Execute the DELETE statement to remove the user
                cursor.execute('''
                    DELETE FROM users
                    WHERE email = %s
                ''', (email,))
            connection.commit()
    except Exception as ex:
        raise Exception(f"Error deleting user: {ex}. Please contact the administrator.")
    
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

def update_event(args: dict) -> None:
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            event_id = args.get('event_id')
            event_name = args.get('event_name')
            event_desc = args.get('event_desc')
            image_link = args.get('image_link')
            event_capacity = args.get('event_capacity')
            start_time = args.get('start_time')
            end_time = args.get('end_time')
            
            esc_str = 'ESCAPE \'\\\''

            sql_query_base = "UPDATE events SET "
            values = []
            if event_name:
                sql_query_base += "event_name = %s, "
                values.append(event_name)
            if event_desc:
                sql_query_base += "event_desc = %s, "
                values.append(event_desc)
            if image_link:
                sql_query_base += "image_link = %s, "
                values.append(image_link)
            if event_capacity:
                sql_query_base += "capacity = %s, "
                values.append(event_capacity)
            if start_time:
                sql_query_base += "start_time = %s, "
                values.append(start_time.isoformat())
            if end_time:
                sql_query_base += "end_time = %s "
                values.append(end_time.isoformat())
            sql_query_base += "WHERE event_id = %s"
            values.append(event_id)

            cursor.execute(sql_query_base, tuple(values))
            connection.commit()
    except Exception as ex:
        connection.rollback()
        raise ex
        raise Exception("It seems there was an error updating the"
                        + " event. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)

def delete_event(event_id: int) -> None:
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                DELETE FROM events 
                WHERE event_id = %s
                ''', (event_id, ))
            connection.commit()
    except Exception as ex:
        connection.rollback()
        raise Exception("It seems there was an error deleting the"
                        + " event. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)

def add_event_registration(email: str):
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

def get_all_communities(email) -> list:
    all_comms_info = []
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
            
            # Get all communities info from communities table
            cursor.execute('''
                SELECT 
                    comm.group_id, comm.group_name, comm.group_desc, 
                    comm.member_count, comm.image_link, 
                    (comm_reg.user_id IS NOT NULL) as is_registered
                FROM 
                    communities comm
                LEFT JOIN 
                    community_registrations comm_reg
                ON 
                    comm.group_id = comm_reg.group_id 
                    AND comm_reg.user_id = %s
            ''', (userId, ))
            
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
                INSERT INTO 
                    communities (group_id, group_name, group_desc, 
                    member_count, image_link)
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
        
def delete_community(group_id: int) -> None:
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                DELETE FROM communities
                WHERE group_id = %s
            ''', (group_id, ))
            connection.commit()
    except Exception as ex:
        connection.rollback()
        raise ex
        raise Exception("It seems there was an error updating the"
                        + " community. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)        
    
def add_community_registration(email: str, group_id: int) -> None:
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
            
            # Add community registration:
            cursor.execute('''
                INSERT INTO
                    community_registrations(unique_id, user_id, 
                    group_id)
                VALUES (DEFAULT, %s, %s)              
            ''', (userId, group_id, ))
            
            cursor.execute('''
                UPDATE communities
                SET member_count = member_count + 1
                WHERE group_id = %s
            ''', (group_id, ))
            
            connection.commit()
    except Exception:
        connection.rollback()
        raise ex
        raise Exception("It seems there was an error registering the"
                        + " user to this community. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)
        
def delete_community_registration(email: str, group_id: int) -> None:
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
            
            # Add community registration:
            cursor.execute('''
                DELETE FROM 
                    community_registrations
                WHERE 
                    user_id = %s AND group_id = %s             
            ''', (userId, group_id, ))
            
            cursor.execute('''
                UPDATE communities
                SET member_count = GREATEST(0, member_count - 1)
                WHERE group_id = %s
            ''', (group_id, ))
            
            connection.commit()
    except Exception:
        connection.rollback()
        raise ex
        raise Exception("It seems there was an error registering the"
                        + " user to this community. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)

def get_community_emails(group_id: int) -> list:
    email_results = []
    connection = _get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT users.email
                FROM users
                JOIN community_registrations ON users.user_id = community_registrations.user_id
                WHERE community_registrations.group_id = %s;
            ''', (group_id, ))
            email_results = cursor.fetchall()

    except Exception:
        connection.rollback()
        raise Exception("It seems there was an error getting the"
                        + " community emails. Please contact the"
                        + " administrator.")
    finally:
        _put_connection(connection)

    return email_results   
#----------------------------------------------------------------------

# Helper functions
