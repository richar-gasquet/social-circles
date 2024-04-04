import os
import psycopg2
import json
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.environ.get('DATABASE_URL')

#----------------------------------------------------------------------

# User methods

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
    """ Get all events the user has registered for

    Args:
        email (str): user's email

    Returns:
        list: list containing all events the user has registered for
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
                    SELECT DISTINCT events.event_name, 
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

def get_all_communities() -> list:
    """ Get all communities in Social Circles

    Returns:
        list: list containing all communities in Social Circles
    """
    
    try: 
        with psycopg2.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor: 
                # Get all available events' info from event table
                cursor.execute('''
                    SELECT communities.group_name
                    FROM communities
                ''')
                
                events_info = cursor.fetchall()
                return events_info
                
    except Exception as ex:
        raise Exception("It seems there was an error getting all"
                        + " communities. Please contact the administrator.")
        
def get_registered_communities(email) -> list:
    """ Get communities the user is a part of

    Args:
        email (str): user's email

    Returns:
        list: list containing all communities the user is a part of
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
                
                # Get communities user is a part of 
                cursor.execute('''
                    SELECT communities.group_name
                    FROM communities
                    INNER JOIN community_registrations ON community_registrations.group_id = communities.group_id
                    WHERE community_registrations.user_id = %s
                ''', [])
                
                events_info = cursor.fetchall()
                return events_info
                
    except Exception as ex:
        raise Exception("It seems there was an error getting the communities"
                        + " you are a part of. Please contact the"
                        + " administrator.")