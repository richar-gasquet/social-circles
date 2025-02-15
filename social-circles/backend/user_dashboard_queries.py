#----------------------------------------------------------------------
# user_dashboard_queries.py: SQL Queries for Social Circles Resources
#----------------------------------------------------------------------

import psycopg2
from database import get_connection, put_connection

#----------------------------------------------------------------------

def get_announcements() -> list:
    """ Get all announcements from the database

    Returns:
        list: list of lists containing all announcement' details
    """
    all_announcements = []
    connection = get_connection()
    try: 
        with connection.cursor() as cursor: 
            # Retrieve all announcements
            cursor.execute('''
                SELECT *
                FROM announcements
            ''')
            all_announcements = cursor.fetchall()
    # Database error
    except Exception:
        raise
    finally:
        put_connection(connection)
        
    return all_announcements
            

def add_announcement(args: dict) -> None:
    """ Add an announcement to the database

    Args:
        args (dict): Dict containing details of announcement to be added
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Extract announcement details to be added
            announcement_name = args.get('announcement_name')
            description = args.get('description')
            image_link = args.get('image_link')
            
            values = (announcement_name, description, image_link)
            
            # Insert announcement into 'announcements' table
            cursor.execute('''
                INSERT INTO 
                    announcements (announcement_id, announcement_name,
                        description, image_link)
                VALUES
                    (DEFAULT, %s, %s, %s)              
            ''', values)
            
            connection.commit()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)

def update_announcement(args: dict) -> None:
    """ Edit an announcement in the database

    Args:
        args (dict): Dict containing details of announcement to be edited
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Extract announcement's details to be edited
            announcement_id = args.get('announcement_id')
            announcement_name = args.get('announcement_name')
            description = args.get('description')
            image_link = args.get('image_link')
            
            # Edit announcement only for updated fields
            sql_query_base = "UPDATE announcements SET "
            values = []
            if announcement_name:
                sql_query_base += "announcement_name = %s, "
                values.append(announcement_name)
            if description:
                sql_query_base += "description = %s, "
                values.append(description)
            if image_link:
                sql_query_base += "image_link = %s, "
                values.append(image_link)

            sql_query_base = sql_query_base[:-2]
            sql_query_base += " WHERE announcement_id = %s"
            values.append(announcement_id)

            cursor.execute(sql_query_base, tuple(values))
            connection.commit()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def delete_announcement(announcement_id: int) -> None:
    """ Delete an announcement from the database

    Args:
        announcement_id (int): ID of the announcement to be deleted
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                DELETE FROM
                    announcements 
                WHERE
                    announcement_id = %s
            ''', (announcement_id, ))
            connection.commit()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)