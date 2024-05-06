#----------------------------------------------------------------------
# event_queries.py: SQL Queries for Social Circles Events
#----------------------------------------------------------------------

import psycopg2
from database import get_connection, put_connection

#----------------------------------------------------------------------
def get_available_events(email) -> list:
    """ Get all events and user's registration status from the database

    Args:
        email (str): email of user sending the request 

    Returns:
        list: list of lists containing all events' details
    """
    all_events = []
    connection = get_connection()
    try: 
        with connection.cursor() as cursor: 
            # Retrieve user information from their email
            cursor.execute('''
                SELECT
                    user_id
                FROM
                    users
                WHERE
                    users.email = %s               
            ''', (email, ))
            user_info = cursor.fetchone()
            
            # User is not in database
            if not user_info:
                put_connection(connection)
                return all_events
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]
            
            # Get all upcoming  events' info from event table, including
            # whether the user is registered/in waitlist for each event
            cursor.execute('''
                SELECT DISTINCT
                    e.event_id, e.event_name, e.event_desc, 
                    e.start_time, e.end_time, e.capacity, 
                    e.filled_spots, e.image_link, e.location, 
                    e.is_dana_event,
                    (e_reg.user_id IS NOT NULL) as is_registered,
                    (e_wait.user_id IS NOT NULL) as is_waitlisted,
                    (e.filled_spots >= e.capacity) as is_full
                FROM 
                    events e
                LEFT JOIN 
                    event_registrations e_reg
                    ON
                        e.event_id = e_reg.event_id
                        AND e_reg.user_id = %s
                LEFT JOIN
                    event_waitlists e_wait
                    ON
                        e.event_id = e_wait.event_id
                        AND e_wait.user_id = %s
                WHERE
                    e.end_time > CURRENT_TIMESTAMP
                ORDER BY
                    e.start_time ASC
            ''', (user_id, user_id, ))
            
            all_events = cursor.fetchall()
    # Database error
    except Exception:
        raise
    finally:
        put_connection(connection)
        
    return all_events

def get_dana_events(email) -> list:
    """ Get events Dana is participating in/hosting from database
    
    Args:
        email (str): email of user sending the request 

    Returns:
        list: list of lists containing all Dana events' details
    """
    dana_events = []
    connection = get_connection()
    try: 
        with connection.cursor() as cursor: 
            # Retrieve user information from their email
            cursor.execute('''
                SELECT
                    user_id
                FROM
                    users
                WHERE
                    users.email = %s               
            ''', (email, ))
            user_info = cursor.fetchone()
            
            # User is not in database
            if not user_info:
                put_connection(connection)
                return dana_events
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]
            
            # Retrieve Dana events' information, including
            # whether the user is registered/in waitlist for each event
            cursor.execute('''
                SELECT DISTINCT
                    e.event_id, e.event_name, e.event_desc, 
                    e.start_time, e.end_time, e.capacity, 
                    e.filled_spots, e.image_link, e.location, 
                    e.is_dana_event,
                    (e_reg.user_id IS NOT NULL) as is_registered,
                    (e_wait.user_id IS NOT NULL) as is_waitlisted,
                    (e.filled_spots >= e.capacity) as is_full
                FROM 
                    events e
                LEFT JOIN 
                    event_registrations e_reg
                    ON
                        e.event_id = e_reg.event_id
                        AND e_reg.user_id = %s
                LEFT JOIN
                    event_waitlists e_wait
                    ON
                        e.event_id = e_wait.event_id
                        AND e_wait.user_id = %s
                WHERE
                    e.end_time > CURRENT_TIMESTAMP AND
                    e.is_dana_event = true
                ORDER BY
                    e.start_time ASC
            ''', (user_id, user_id, ))
            
            all_events = cursor.fetchall()
    # Database error
    except Exception:
        raise
    finally:
        put_connection(connection)
        
    return all_events
        
def get_registered_events(email: str) -> list:
    """ Get events a user is registered for from the database

    Args:
        email (str): email of user sending the request 

    Returns:
        list: list of lists containing registered events' details
    """
    registered_events = []
    connection = get_connection()
    try: 
        with connection.cursor() as cursor:
            # Retrieve user information from their email
            cursor.execute('''
                SELECT
                    user_id
                FROM
                    users
                WHERE
                    users.email = %s               
            ''', (email, ))
            user_info = cursor.fetchone()
            
            # User is not in database
            if not user_info:
                put_connection(connection)
                return registered_events
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]
            
            # Retrieve registered events' information, including
            # whether the user is registered/in waitlist for each event
            cursor.execute('''
                SELECT DISTINCT
                        e.event_id, e.event_name, e.event_desc, 
                        e.start_time, e.end_time, e.capacity, 
                        e.filled_spots, e.image_link, e.location, 
                        e.is_dana_event,
                        (e_reg.user_id IS NOT NULL) as is_registered,
                        (e_wait.user_id IS NOT NULL) as is_waitlisted,
                        (e.end_time < CURRENT_TIMESTAMP) as in_past
                FROM   
                    events e
                LEFT JOIN 
                    event_registrations e_reg 
                    ON 
                        e.event_id = e_reg.event_id AND 
                        e_reg.user_id = %s
                LEFT JOIN
                    event_waitlists e_wait
                    ON
                        e.event_id = e_wait.event_id AND 
                        e_wait.user_id = %s
                WHERE 
                    e_reg.user_id = %s OR
                    e_wait.user_id = %s
                ORDER BY
                    e.end_time DESC
            ''', (user_id, user_id, user_id, user_id, ))
            
            registered_events = cursor.fetchall()
    # Database error
    except Exception:
        raise
    finally:
        put_connection(connection)
        
    return registered_events

def get_past_events(email) -> list:
    past_events = []
    connection = get_connection()
    try: 
        with connection.cursor() as cursor: 
            # Retrieve user information from their email
            cursor.execute('''
                SELECT
                    user_id
                FROM
                    users
                WHERE
                    users.email = %s               
            ''', (email, ))
            user_info = cursor.fetchone()
            
            if not user_info:
                put_connection(connection)
                return past_events
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]
            # Get past events' info from event table
            cursor.execute('''
                SELECT DISTINCT
                    e.event_id, e.event_name, e.event_desc, 
                    e.start_time, e.end_time, e.capacity, 
                    e.filled_spots, e.image_link, e.location, 
                    e.is_dana_event
                FROM 
                    events e
                WHERE
                    e.end_time < CURRENT_TIMESTAMP
                ORDER BY
                    e.end_time DESC
            ''', (user_id, ))
            
            past_events = cursor.fetchall()
    except Exception:
        raise
    finally:
        put_connection(connection)
        
    return past_events

def add_event(args: dict) -> None:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            event_name = args.get('event_name')
            event_desc = args.get('event_desc')
            capacity = args.get('capacity')
            location = args.get('location')
            is_dana_event = args.get('isDanaEvent')
            image_link = args.get('image_link')
            start_time = args.get('start_time')
            end_time = args.get('end_time')
            
            values = (event_name, event_desc, capacity, location,
                      is_dana_event, image_link, start_time,
                      end_time)
            
            cursor.execute('''
                INSERT INTO 
                    events (event_id, event_name, event_desc, capacity, 
                            location, is_dana_event, filled_spots, 
                            image_link, start_time, end_time)                        
                VALUES 
                    (DEFAULT, %s, %s, %s, %s, %s, 0, %s, %s, %s);               
            ''', values)
            connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)

def update_event(args: dict) -> None:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            event_id = args.get('event_id')
            event_name = args.get('event_name')
            event_desc = args.get('event_desc')
            capacity = args.get('capacity')
            location = args.get('location')
            is_dana_event = args.get('isDanaEvent')
            image_link = args.get('image_link')
            start_time = args.get('start_time')
            end_time = args.get('end_time')
            
            sql_query_base = "UPDATE events SET "
            values = []

            if event_name:
                sql_query_base += "event_name = %s, "
                values.append(event_name)
            if event_desc:
                sql_query_base += "event_desc = %s, "
                values.append(event_desc)
            if capacity:
                sql_query_base += "capacity = %s, "
                values.append(capacity)
            if location:
                sql_query_base += "location = %s, "
                values.append(location)
            if is_dana_event != "unchanged":
                sql_query_base += "is_dana_event = %s, "
                values.append(is_dana_event)
            if image_link:
                sql_query_base += "image_link = %s, "
                values.append(image_link)
            if start_time:
                sql_query_base += "start_time = %s, "
                values.append(start_time)
            if end_time:
                sql_query_base += "end_time = %s, "
                values.append(end_time)
                
            sql_query_base = sql_query_base[:-2]

            sql_query_base += " WHERE event_id = %s"
            values.append(event_id)

            cursor.execute(sql_query_base, tuple(values))
            connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)

def delete_event(event_id: int) -> None:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                DELETE FROM 
                    events 
                WHERE 
                    event_id = %s
            ''', (event_id, ))
            connection.commit()
    except Exception as ex:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
            
    
def add_event_registration(email: str, event_id: int):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Retrieve user information from their email
            cursor.execute('''
                SELECT
                    user_id
                FROM
                    users
                WHERE
                    users.email = %s               
            ''', (email, ))
            user_info = cursor.fetchone()
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]
            
            values = (user_id, event_id)
            
            # Add event registration
            cursor.execute('''
                INSERT INTO
                    event_registrations (registr_id, user_id, 
                                            event_id)
                VALUES 
                    (DEFAULT, %s, %s)              
            ''', values)
            
            cursor.execute('''
                UPDATE 
                    events
                SET 
                    filled_spots = filled_spots + 1
                WHERE 
                    event_id = %s
            ''', (event_id, ))
            
            connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)

def delete_event_registration(email: str, event_id: int):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Retrieve user information from their email
            cursor.execute('''
                SELECT
                    user_id
                FROM
                    users
                WHERE
                    users.email = %s               
            ''', (email, ))
            user_info = cursor.fetchone()
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]
            
            values = (user_id, event_id)
            
            cursor.execute('''
                DELETE FROM 
                    event_registrations
                WHERE 
                    user_id = %s AND event_id = %s             
            ''', values)
            
            cursor.execute('''
                UPDATE 
                    events
                SET 
                    filled_spots = GREATEST(0, filled_spots - 1)
                WHERE 
                    event_id = %s
            ''', (event_id, ))
            
            connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def get_event_name(event_id: int) -> str:
    event_name = ""
    connection = get_connection()
    try: 
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT 
                    e.event_name
                FROM          
                    events e
                WHERE
                    e.event_id = %s     
            ''', (event_id, ))
            result = cursor.fetchone()
            if result:
                event_name = result[0]
    except Exception as ex:
        raise
    return event_name

def get_event_emails(event_id: int) -> list:
    """_summary_

    Args:
        event_id (int): _description_

    Returns:
        list: _description_
    """
    event_emails = []
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT 
                    users.email
                FROM 
                    users
                INNER JOIN 
                    event_registrations 
                ON 
                    users.user_id = event_registrations.user_id
                WHERE 
                    event_registrations.event_id = %s;
            ''', (event_id, ))
            event_emails = cursor.fetchall()
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)

    return event_emails

def get_event_info(event_id: int, user_email: str):
    event_info = {}
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # First, get the user_id from the user_email
            cursor.execute('''
                SELECT user_id FROM users WHERE email = %s;
            ''', (user_email,))
            user_result = cursor.fetchone()
            if not user_result:
                put_connection(connection)
                return event_info  # No such user

            user_id = user_result[0]

            # Now, fetch the event details along with registration and waitlist status
            cursor.execute('''
                SELECT 
                    e.event_id, e.event_name, e.event_desc, e.start_time, 
                    e.end_time, e.capacity, e.filled_spots, e.image_link, 
                    e.location, e.is_dana_event,
                    (SELECT COUNT(*) 
                        FROM 
                            event_registrations er 
                        WHERE 
                            er.event_id = e.event_id AND er.user_id = %s) > 0 AS is_registered,
                    (SELECT COUNT(*) 
                        FROM event_waitlists ew 
                            WHERE 
                                ew.event_id = e.event_id AND ew.user_id = %s) > 0 AS is_waitlisted,
                    e.filled_spots >= e.capacity AS is_full,
                    (e.end_time < CURRENT_TIMESTAMP) as in_past
                FROM 
                    events e
                WHERE 
                    e.event_id = %s;
            ''', (user_id, user_id, event_id))

            event_info = cursor.fetchone()
    except Exception as ex:
        raise
    finally:
        put_connection(connection)
    return event_info


def get_users_for_event(event_id):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Get all user IDs registered for the event
            cursor.execute('''
                SELECT 
                    user_id
                FROM 
                    event_registrations
                WHERE 
                    event_id = %s;
            ''', (event_id,))
            rows = cursor.fetchall()

            # If no users are found, return an empty list immediately
            if not rows:
                return []

            # Extract user_ids from rows
            user_ids = [row[0] for row in rows] 

            # Prepare SQL query to retrieve details for registered users
            placeholders = ', '.join(['%s'] * len(user_ids))
            sql_query = f"SELECT * FROM users WHERE user_id IN ({placeholders})"
            
            cursor.execute(sql_query, tuple(user_ids))
            user_info = cursor.fetchall()
            return user_info
    # Database error
    except Exception:
        raise
    finally:
        put_connection(connection)
        
# ---------------------------------------------------------------------
# Queries/Helper functions for WAITLIST functionality
# ---------------------------------------------------------------------

def get_event_spots(event_id: str) -> list:
    """ Get filled spots and capacity for a particular event

    Args:
        event_id (str): ID of event to get spots for

    Returns:
        list: list containing filled spots and capacity for the event
    """
    event_spots = []
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT 
                    e.filled_spots, e.capacity   
                FROM
                    events e
                WHERE
                    e.event_id = %s            
            ''', (event_id, ))
            event_spots = cursor.fetchone()
    except Exception:
        raise
    finally:
        put_connection(connection)
    return event_spots

def add_to_waitlist(email: str, event_id: int) -> None:
    """ Add a user to an event's waitlist

    Args:
        email (str): email of the user to be added to the waitlist
        event_id (int): id of the event the waitlist is for
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Retrieve user information from their email
            cursor.execute('''
                SELECT
                    user_id
                FROM
                    users
                WHERE
                    users.email = %s               
            ''', (email, ))
            user_info = cursor.fetchone()
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]
            
            values = (user_id, event_id)
            
            cursor.execute('''
                INSERT INTO 
                    event_waitlists (user_id, event_id)  
                VALUES
                    (%s, %s)             
            ''', values)
            connection.commit()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
    
def remove_from_waitlist(email: str, event_id: int) -> None:
    """ Remove a user from an event's waitlist

    Args:
        email (str): email of the user to be removed from the waitlist
        event_id (int): id of the event the waitlist is for
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Retrieve user information from their email
            cursor.execute('''
                SELECT
                    user_id
                FROM
                    users
                WHERE
                    users.email = %s               
            ''', (email, ))
            user_info = cursor.fetchone()
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]
            
            values = (user_id, event_id)
            
            cursor.execute('''
                DELETE FROM
                    event_waitlists
                WHERE
                    user_id = %s AND event_id = %s              
            ''', values)
            connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def get_first_waitlist_user(event_id: int) -> str:
    """ Get the first user to have joined the waitlist for an event

    Args:
        event_id (int): id of the event the waitlist is for

    Returns:
        str: email of the first user who joined the event's waitlist
    """
    waitlist_user_email = None
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Retrieve single user's email
            cursor.execute('''
                SELECT 
                    u.email
                FROM 
                    event_waitlists e_wait
                JOIN
                    users u
                    ON 
                        e_wait.user_id = u.user_id
                WHERE 
                    e_wait.event_id = %s
                ORDER BY 
                    e_wait.timestamp ASC
                LIMIT 
                    1
            ''', (event_id, ))
            result = cursor.fetchone()
            if result:
                waitlist_user_email = result[0]
    # Database error
    except Exception:
        raise
    finally:
        put_connection(connection)
    return waitlist_user_email