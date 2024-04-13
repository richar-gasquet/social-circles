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
            
            values = (first_name, last_name, email, address, 
                      preferred_name, pronouns, phone_number, 
                      marital_status, family_circumstance, 
                      community_status, interests, personal_identity)
            
            cursor.execute('''
                INSERT INTO 
                    users (first_name, last_name, email, address, 
                            preferred_name, pronouns, phone_number, 
                            marital_status, family_circumstance, 
                            community_status, interests, 
                            personal_identity)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', values)
            
            connection.commit()
    except Exception:
        raise
    finally:
        put_connection(connection)

def update_user(args: dict):
    connection = get_connection()
    # MUST FIX SO ONLY CHANGED ENTRIES ARE SET, LOOK AT UPDATE COMMUNITY
    # / UPDATE EVENTS
    try:
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
            
            values = (first_name, last_name, email, address, 
                      preferred_name, pronouns, phone_number, 
                      marital_status, family_circumstance, 
                      community_status, interests, personal_identity)
            
            # Update SQL query
            cursor.execute('''
                UPDATE 
                    users
                SET 
                    first_name = %s, last_name = %s, address = %s, preferred_name = %s, pronouns = %s, 
                    phone_number = %s, marital_status = %s, family_circumstance = %s, community_status = %s, 
                    interests = %s, personal_identity = %s
                WHERE 
                    email = %s
            ''', values)
        connection.commit()
    except Exception:
        raise
    finally:
        put_connection(connection)

def delete_user(email: str):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Execute the DELETE statement to remove the user
            cursor.execute('''
                DELETE FROM 
                    users
                WHERE 
                    email = %s
            ''', (email,))
        connection.commit()
    except Exception:
        raise
    finally:
        put_connection(connection)