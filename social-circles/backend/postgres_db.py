import os
import psycopg2
import json
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.environ.get('DATABASE_URL')

#----------------------------------------------------------------------

# User methods

#----------------------------------------------------------------------

# Event methods

def get_available_events(email: str) -> list:
    """ Get all events available to user

    Args:
        email (dict): user's email

    Returns:
        list: list containing all events available to user
    """
    
    try: 
        with psycopg2.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:
                # Get user results based on their email
                cursor.execute(f'''
                    SELECT user_id
                    FROM users
                    WHERE users.email = %s
                ''', (email,))
                
                user_results = cursor.fetchone()
                
                # Get userId (index 0 for user's row)
                userId = user_results[0]
                
                # Get all available events' info from event table
                cursor.execute(f'''
                    SELECT DISTINCT events.event_id, events.event_name,
                        events.date_and_time, events.capacity, 
                        events.filled_spots
                    FROM events
                    INNER JOIN event_tags ON events.event_id = event_tags.event_id
                    INNER JOIN community_registrations ON event_tags.group_id = community_registrations.group_id
                    WHERE community_registrations.user_id = %
                ''', (userId,))
                
                events_info = cursor.fetchall()
                
                return events_info
                
    except Exception:
        raise Exception("It seems there was an error getting all"
                        + " events. Please contact the administrator.")
        
def get_registered_events(email: str) -> list:
    """ Get events user has registered for

    Args:
        email (str): user's email

    Returns:
        list: list containing event details queried by the server
    """
    pass

def get_event_details(eventId: int) -> list:
    """ Get event details for a single event

    Args:
        eventId (int): dict containing filters for query

    Returns:
        list: list containing event details queried by the server
    """
    
    try: 
        with psycopg2.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:
                pass
                
    except Exception:
        raise Exception("It seems there was an error getting event"
                        + " details. Please contact the administrator.")
        
#----------------------------------------------------------------------

# Community methods


