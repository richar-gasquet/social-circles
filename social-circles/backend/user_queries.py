#----------------------------------------------------------------------
# user_queries.py: SQL Queries for Social Circles Users
#----------------------------------------------------------------------

import psycopg2
from database import get_connection, put_connection

def get_user_details(email: str) -> list:
    user_details = []
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT 
                    *
                FROM 
                    users
                WHERE 
                    email = %s
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
    except Exception:
        raise
    finally:
        put_connection(connection)
    
    return user_details

# Get user authorization (regular user / admin)
def get_user_authorization(email: str) -> bool:
    is_admin = False
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT 
                    users.is_admin
                FROM 
                    users
                WHERE 
                    users.email = %s
            ''', (email,))
            authorization_status = cursor.fetchone()
            
            # Need to change this eventually since all users will be
            # forced to register and therefore will always have an
            # authorization statues.
            if authorization_status:
                is_admin = authorization_status[0]
    except Exception:
        raise
    finally:
        put_connection(connection)
    return is_admin

def add_user(args: dict) -> None:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Initialize lists to hold SQL columns and corresponding values
            columns = []
            values = []
            # Check each field in args and add non-empty values to lists
            for field in ['first_name', 'last_name', 'email', 'address', 
                          'preferred_name', 'pronouns', 'phone_number', 
                          'marital_status', 'family_circumstance', 
                          'community_status', 'interests', 'personal_identity', 'profile_photo']:
                if args.get(field):
                    columns.append(field)
                    values.append(args[field])
            
            # Construct the SQL query dynamically based on non-empty values
            sql = f'''
                INSERT INTO users ({', '.join(columns)})
                VALUES ({', '.join(['%s'] * len(columns))})
            '''
            
            # Execute the query with the non-empty values
            cursor.execute(sql, tuple(values))
            connection.commit()
    except Exception:
        raise
    finally:
        put_connection(connection)

def update_user(args: dict):
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
            ''', (args['email'], ))
            user_info = cursor.fetchone()

            if user_info is None:
                raise ValueError("User not found.")
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]


            # Dictionary of field mappings
            field_map = {
                'first_name': 'first_name',
                'last_name': 'last_name',
                'email': 'email',  # This should remain constant as it's used in WHERE clause
                'address': 'address',
                'preferred_name': 'preferred_name',
                'pronouns': 'pronouns',
                'phone_number': 'phone_number',
                'marital_status': 'marital_status',
                'family_circumstance': 'family_circumstance',
                'community_status': 'community_status',
                'interests': 'interests',
                'personal_identity': 'personal_identity',
                'profile_photo' : 'profile_photo'
            }

            # Filtering out empty values and preparing SQL parts
            update_fields = []
            update_values = []
            for key, db_field in field_map.items():
                if key in args and args[key]:
                    update_fields.append(f"{db_field} = %s")
                    update_values.append(args.get(key))

            # Construct the dynamic SQL query
            if update_fields:
                sql = f"UPDATE users SET {', '.join(update_fields)} WHERE user_id = %s"
                update_values.append(user_id)

                # Execute the update query
                cursor.execute(sql, tuple(update_values))
                connection.commit()
    except Exception:
        raise
    finally:
        put_connection(connection)

def delete_user(email: str):
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

            if user_info is None:
                raise ValueError("User not found.")
            
            # Retrieve user's user_id at index 0
            user_id = user_info[0]

            # Execute the DELETE statement to remove the user
            # Start transaction

            # Dependent tables
            dependent_tables = ['event_registrations', 'community_registrations']
            for table in dependent_tables:
                cursor.execute(f'''
                    DELETE FROM 
                        {table}
                    WHERE 
                        user_id = %s
                ''', (user_id,))

            # Delete from users table
            cursor.execute('''
                DELETE FROM 
                    users
                WHERE 
                    user_id = %s
            ''', (user_id,))

            # Commit all changes
            connection.commit()
    except Exception as e:
        connection.rollback()  # Rollback in case of any error
        raise e
    finally:
        put_connection(connection)


def get_all_user_details() -> list:
    all_user_details = []
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT 
                    *
                FROM 
                    users
            ''')

            user_rows = cursor.fetchall()
            
            for user_row in user_rows:
                user_details = {
                    'user_id': user_row[0],
                    'first_name': user_row[1],
                    'last_name': user_row[2],
                    'email': user_row[3],
                    'is_admin': user_row[4],  
                    'address': user_row[5],
                    'preferred_name': user_row[6],
                    'pronouns': user_row[7],
                    'phone_number': user_row[8],
                    'marital_status': user_row[9],
                    'family_circumstance': user_row[10],
                    'community_status': user_row[11],
                    'interests': user_row[12],
                    'personal_identity': user_row[13]
                }
                all_user_details.append(user_details)
    except Exception as e:
        raise e
    finally:
        put_connection(connection)
    
    return all_user_details


def block_and_delete_user(email: str):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Retrieve user's details before deleting
            cursor.execute('''
                SELECT first_name, last_name, email
                FROM users
                WHERE email = %s
            ''', (email,))
            user_details = cursor.fetchone()

            if user_details is None:
                raise ValueError("User not found.")

            # Add user to block
            cursor.execute('''
                INSERT INTO blocked_users (first_name, last_name, email)
                VALUES (%s, %s, %s)
            ''', (user_details[0], user_details[1], user_details[2]))
            # Commit changes
            connection.commit()

            # Delete user from the users table
            delete_user(email)
    except Exception as e:
        connection.rollback()  # Rollback in case of any error
        raise e
    finally:
        put_connection(connection)


def get_all_blocked_users():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT first_name, last_name, email
                FROM blocked_users
            ''')
            blocked_users = cursor.fetchall()
            return [{'first_name': user[0], 'last_name': user[1], 'email': user[2]} for user in blocked_users]
    except Exception as e:
        raise e
    finally:
        put_connection(connection)


def remove_user_from_block(email: str):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                DELETE FROM blocked_users
                WHERE email = %s
            ''', (email,))
            connection.commit()
    except Exception as e:
        connection.rollback()  # Rollback in case of any error
        raise e
    finally:
        put_connection(connection)

def is_in_block(email: str) -> bool:
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT EXISTS(
                    SELECT 1 FROM blocked_users WHERE email = %s
                )
            ''', (email,))
            is_blocked = cursor.fetchone()[0]
            return is_blocked
    except Exception as e:
        print(f"Error checking if user is in block: {e}")
        raise
    finally:
        put_connection(connection)
