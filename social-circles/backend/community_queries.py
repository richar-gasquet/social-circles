#----------------------------------------------------------------------
# communities_queries.py: SQL Queries for Social Circles Communities
#----------------------------------------------------------------------

import psycopg2
from database import get_connection, put_connection

def get_all_communities(email) -> list:
    """_summary_

    Args:
        email (_type_): _description_

    Returns:
        list: _description_
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
            
            if not user_info:
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
    except Exception:
        raise
    finally:
        put_connection(connection)
        
    return all_communities

def get_registered_communities(email) -> list:
    """_summary_

    Args:
        email (_type_): _description_

    Returns:
        list: _description_
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
            
            if not user_info:
                return registered_communities
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]
            
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
    except Exception:
        raise
    finally:
        put_connection(connection)
    
    return registered_communities

def add_community(args: dict) -> None:
    connection = get_connection()
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
                VALUES
                    (DEFAULT, %s, %s, 0, %s)              
            ''', values)
            
            connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def update_community(args: dict) -> None:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            group_id = args.get('group_id')
            group_name = args.get('group_name')
            group_desc = args.get('group_desc')
            image_link = args.get('image_link')

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
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def delete_community(group_id: int) -> None:
    """_summary_

    Args:
        group_id (int): _description_
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
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)    
        
def add_community_registration(email: str, group_id: int) -> None:
    """_summary_

    Args:
        email (str): _description_
        group_id (int): _description_
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
            
            cursor.execute('''
                UPDATE 
                    communities
                SET 
                    member_count = member_count + 1
                WHERE 
                    group_id = %s
            ''', (group_id, ))
            
            connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def delete_community_registration(email: str, group_id: int) -> None:
    """_summary_

    Args:
        email (str): _description_
        group_id (int): _description_
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
            
            cursor.execute('''
                DELETE FROM 
                    community_registrations
                WHERE 
                    user_id = %s AND group_id = %s             
            ''', values)
            
            cursor.execute('''
                UPDATE communities
                SET member_count = GREATEST(0, member_count - 1)
                WHERE group_id = %s
            ''', (group_id, ))
            
            connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def get_community_emails(group_id: int) -> list:
    """_summary_

    Args:
        group_id (int): _description_

    Returns:
        list: _description_
    """
    community_emails = []
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
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
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)

    return community_emails   

def get_one_group_info_with_user_status(group_id: int, user_email: str):
    group_info = {}
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # First, get the user_id from the user_email
            cursor.execute('''
                SELECT user_id FROM users WHERE email = %s;
            ''', (user_email,))
            user_result = cursor.fetchone()
            print(user_result)
            if not user_result:
                return group_info  # No such user

            user_id = user_result[0]
            print(user_id)
            print(group_id)
            # Now, fetch the event details along with registration and waitlist status
            cursor.execute('''
                SELECT 
                    c.group_id, c.group_name, c.group_desc, 
                    c.member_count, c.image_link, 
                    (SELECT COUNT(*) FROM community_registrations cr WHERE cr.group_id = c.group_id AND cr.user_id = %s) > 0 AS is_registered
                    
                FROM 
                    communities c
                WHERE 
                    c.group_id = %s;
            ''', (user_id, group_id))

            group_info = cursor.fetchone()
            print(group_info)
    except Exception as ex:
        print("Error fetching community info:", ex)
    finally:
        put_connection(connection)
    return group_info

def get_users_for_group(group_id):
    rows = []
    user_ids= []
    user_info = []
    connection = get_connection()
    try: 
        with connection.cursor() as cursor: 
            # Get all users registered for the community
            # from the community_registrations table
            cursor.execute('''
                SELECT *
                FROM community_registrations
                WHERE group_id = %s;
            ''', (group_id, ))
            rows = cursor.fetchall()

            if rows:
                for row in rows:
                    user_ids.append(row[1])
                
                sql_query_base = "SELECT * FROM users WHERE "

                i = 0
                for _ in user_ids:
                    if (i == 0):
                        sql_query_base += "user_id = %s"
                    else:
                        sql_query_base += " OR user_id = %s"
                    i = i + 1
                cursor.execute(sql_query_base, tuple(user_ids))
                user_info = cursor.fetchall()
                return user_info
            else:
                user_info = []

    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
    return user_info