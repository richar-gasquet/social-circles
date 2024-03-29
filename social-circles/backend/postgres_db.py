import os
import psycopg2
import json
from dotenv import load_dotenv

load_dotenv()
#DATABASE_URL = os.environ.get('DATABASE_URL')
DATABASE_URL = 'postgres://social_circles_db_user:HMqB9hR2Mc0vuYSE3HXoFomKBq2hYkhq@dpg-cnu7t7vjbltc73dcq1cg-a.ohio-postgres.render.com/social_circles_db'

#----------------------------------------------------------------------

# User methods

#----------------------------------------------------------------------

# Event methods

def get_available_events() -> list:
    """ Get all events available to user

    Returns:
        list: list containing all events available to user
    """
    
    try: 
        with psycopg2.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor: 
                # Get all available events' info from event table
                cursor.execute('''
                    SELECT DISTINCT events.event_id, events.event_name,
                           events.date_and_time, events.capacity, 
                           events.filled_spots
                    FROM events
                ''')
                
                events_info = cursor.fetchall()
                return events_info
                
    except Exception as ex:
        raise Exception("It seems there was an error getting all"
                        + " events. Please contact the administrator.")
        
def get_registered_events(email: str) -> list:
    """ Get events user has registered for

    Args:
        email (str): user's email

    Returns:
        list: list containing event the user has registered for
    """
    try: 
        with psycopg2.connect(DATABASE_URL) as connection:
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
                           events.date_and_time, events.capacity, 
                           events.filled_spots
                    FROM events
                    INNER JOIN event_registrations ON events.event_id = event_registrations.event_id
                    WHERE event_registrations.user_id = %s
                ''', (userId,))
                
                events_info = cursor.fetchall()
                return events_info
                
    except Exception as ex:
        raise Exception("It seems there was an error getting the events"
                        + " you registered for. Please contact the"
                        + " administrator.")
        
#----------------------------------------------------------------------

# Community methods


