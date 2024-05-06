#----------------------------------------------------------------------
# community_queries.py: SQL Queries for Social Circles Communities
#----------------------------------------------------------------------

import psycopg2
from database import get_connection, put_connection

#-----------------------------------------------------------------------

def get_all_communities(email: str) -> list:
    """ Get all communities and user's registration status from the database

    Args:
        email (str): email of user sending the request 

    Returns:
        list: list of lists containing all communities' details
    """
    all_communities = []
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
                return all_communities
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]
            
            # Retrieve all communities' information, including whether
            # the user is registered for each community
            cursor.execute('''
                SELECT DISTINCT
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
                ORDER BY
                    comm.member_count DESC
            ''', (user_id, ))
            
            all_communities = cursor.fetchall()
    # Database error
    except Exception:
        raise
    finally:
        put_connection(connection)
        
    return all_communities

def get_registered_communities(email: str) -> list:
    """ Get communities a user is a member of from the database

    Args:
        email (str): email of user sending the request 

    Returns:
        list: list of lists containing registered communities' details
    """
    registered_communities = []
    connection = get_connection()
    
    try:
        with connection.cursor() as cursor:
            # Retrieve user information from their email
            cursor.execute('''
                SELECT DISTINCT
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
                return registered_communities
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]
            
            # Retrieve registered communities' information
            cursor.execute('''
                SELECT
                    comm.group_id, comm.group_name, comm.group_desc, 
                    comm.member_count, comm.image_link,
                    TRUE as is_registered
                FROM 
                    communities comm
                INNER JOIN 
                    community_registrations comm_reg
                ON 
                    comm.group_id = comm_reg.group_id 
                WHERE
                    comm_reg.user_id = %s
                ORDER BY
                    comm.member_count DESC
            ''', (user_id, ))
            
            registered_communities = cursor.fetchall()
    # Database error
    except Exception:
        raise
    finally:
        put_connection(connection)
    
    return registered_communities

def add_community(args: dict) -> None:
    """ Add a community to the database

    Args:
        args (dict): Dict containing details of community to be added
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Extract community's details to be added
            group_name = args.get('group_name')
            group_desc = args.get('group_desc')
            image_link = args.get('image_link')
            
            values = (group_name, group_desc, image_link)
            
            # Insert community into 'communities' table
            cursor.execute('''
                INSERT INTO 
                    communities (group_id, group_name, group_desc,
                                member_count, image_link)
                VALUES
                    (DEFAULT, %s, %s, 0, %s)              
            ''', values)
            
            connection.commit()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def update_community(args: dict) -> None:
    """ Edit a community in the database

    Args:
        args (dict): Dict containing details of community to be edited
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Extract community's details to be edited
            group_id = args.get('group_id')
            group_name = args.get('group_name')
            group_desc = args.get('group_desc')
            image_link = args.get('image_link')

            # Edit community only for updated fields
            values = []
            sql_query_base = "UPDATE communities SET "
            if group_name:
                sql_query_base += "group_name = %s, "
                values.append(group_name)
            if group_desc:
                sql_query_base += "group_desc = %s, "
                values.append(group_desc)
            if image_link:
                sql_query_base += "image_link = %s, "
                values.append(image_link)

            sql_query_base = sql_query_base[:-2]

            sql_query_base += " WHERE group_id = %s "
            values.append(group_id)

            cursor.execute(sql_query_base, tuple(values))
            connection.commit()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def delete_community(group_id: int) -> None:
    """ Delete a community from the database

    Args:
        group_id (int): ID of the community to be deleted
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                DELETE FROM 
                    communities
                WHERE 
                    group_id = %s
            ''', (group_id, ))
            connection.commit()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)    
        
def add_community_registration(email: str, group_id: int) -> None:
    """ Add a user to a community's membership in the database.

    Args:
        email (str): Email of user to be added to the community
        group_id (int): ID of the community the user will be added to
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
            
            values = (user_id, group_id)
            
            # Add community registration
            cursor.execute('''
                INSERT INTO
                    community_registrations (unique_id, user_id, 
                                            group_id)
                VALUES 
                    (DEFAULT, %s, %s)              
            ''', values)
            
            # Increase member count to reflect addition
            cursor.execute('''
                UPDATE 
                    communities
                SET 
                    member_count = member_count + 1
                WHERE 
                    group_id = %s
            ''', (group_id, ))
            
            connection.commit()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def delete_community_registration(email: str, group_id: int) -> None:
    """ Remove a user from a community's membership in the database.

    Args:
        email (str): Email of the user to be removed from the community
        group_id (int): ID of the community the user will be removed from
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
            
            values = (user_id, group_id)
            
            # Delete community registration
            cursor.execute('''
                DELETE FROM 
                    community_registrations
                WHERE 
                    user_id = %s AND group_id = %s             
            ''', values)
            
            # Reduce member count to reflect addition
            cursor.execute('''
                UPDATE 
                    communities
                SET 
                    member_count = GREATEST(0, member_count - 1)
                WHERE 
                    group_id = %s
            ''', (group_id, ))
            
            connection.commit()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def get_community_emails(group_id: int) -> list:
    """ Get emails of all users registered to a particular community
        from the database

    Args:
        group_id (int): ID of community to get emails for

    Returns:
        list: List of user emails belonging to the community
    """
    community_emails = []
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Retrieve user emails from database
            cursor.execute('''
                SELECT 
                    users.email
                FROM 
                    users
                INNER JOIN 
                    community_registrations 
                ON 
                    users.user_id = community_registrations.user_id
                WHERE 
                    community_registrations.group_id = %s;
            ''', (group_id, ))
            community_emails = cursor.fetchall()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)

    return community_emails   

def get_community_info(group_id: int, user_email: str) -> list:
    """ Get details for a particular community from the database

    Args:
        group_id (int): ID of community to get details for
        user_email (str): email of user requesting details

    Returns:
        list: List containing the community's details
    """
    group_info = {}
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Get the user_id from the user_email
            cursor.execute('''
                SELECT user_id FROM users WHERE email = %s;
            ''', (user_email,))
            user_result = cursor.fetchone()

            if not user_result:
                put_connection(connection)
                return group_info  # No such user

            user_id = user_result[0]
            
            # Fetch the community details along with registration status
            cursor.execute('''
                SELECT 
                    c.group_id, c.group_name, c.group_desc, 
                    c.member_count, c.image_link, 
                    (SELECT COUNT(*)
                        FROM 
                            community_registrations cr 
                        WHERE 
                            cr.group_id = c.group_id AND cr.user_id = %s) > 0 
                            AS is_registered
                FROM 
                    communities c
                WHERE 
                    c.group_id = %s;
            ''', (user_id, group_id))

            group_info = cursor.fetchone()
    # Database error
    except Exception as ex:
        raise
    finally:
        put_connection(connection)
        
    return group_info

def get_users_for_community(group_id: int) -> list:
    """
    Get all users belonging to a particular community from the database.

    Args:
        group_id (int): ID of the community to get users from.

    Returns:
        list: List of lists containing details of each user in the community.
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Get all user IDs registered for the community
            cursor.execute('''
                SELECT 
                    user_id
                FROM 
                    community_registrations
                WHERE 
                    group_id = %s;
            ''', (group_id,))
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