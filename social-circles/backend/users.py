#----------------------------------------------------------------------
# users.py: Flask methods for user-related requests
#----------------------------------------------------------------------

import flask
import user_queries as db

#----------------------------------------------------------------------

def get_all_users() -> tuple:
    """ Return all users in Social Circles

    Returns:
        tuple: JSON containing users and HTTP code
    """
    # Check if user is authenticated and has authorization to perform action
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):  # Check if user is logged in and is authorized
        try:
            # Return list of all users
            all_user_details = db.get_all_user_details()
            return flask.jsonify(all_user_details), 200  # OK
        # Errro from database
        except Exception as ex:
            print(f'users.py: {str(ex)}')
            return flask.jsonify({
                'status': 'error',
                'message': 'Failed to fetch user data'
            }), 500  # Internal Server Error
    else:
        return flask.jsonify({
            'status': 'error',
            'message': 'Unauthorized access'
        }), 403  # Forbidden

def get_user_data() -> tuple:
    """ Return all details of the current user

    Returns:
        tuple: JSON containing current user's details and HTTP code
    """
    # Check if user is logged on server-side
    if 'email' in flask.session:
        # Fetch all of the current user's details and return
        user_details = db.get_user_details(flask.session['email'])
        if user_details:
            return flask.jsonify({
                'first_name' : user_details['first_name'],
                'last_name' : user_details['last_name'],
                'email': user_details['email'],
                'is_admin': user_details['is_admin'],  
                'address' : user_details['address'],
                'preferred_name' : user_details['preferred_name'],
                'pronouns' : user_details['pronouns'],
                'phone_number' : user_details['phone_number'],
                'marital_status' : user_details['marital_status'],
                'family_circumstance' : user_details['family_circumstance'],
                'community_status' : user_details['community_status'],
                'interests' : user_details['interests'],
                'personal_identity' : user_details['personal_identity'],
                'picture' : flask.session['picture']
            }), 200  # OK
        else:
            return flask.jsonify({
                'name': flask.session['name'],
                'email': flask.session['email']
            }), 200  # OK
    else:
        return flask.jsonify({
            'status': 'error',
            'message': 'User not logged in'
        }), 401  # Unauthorized

def add_user_data() -> tuple:
    """ Add a user

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    
    # Check if user is initially authenticated
    if 'email' in flask.session:
        try:
            # Parse user data to add sent from frontend
            user_data = flask.request.json
            user_dict = {
                'first_name': user_data.get('first_name', '')[:50],
                'last_name': user_data.get('last_name', '')[:50],
                'email': user_data.get('email', '')[:50],
                'address': user_data.get('address', '')[:50],
                'preferred_name': user_data.get('preferred_name', '')[:50],
                'pronouns': user_data.get('pronouns', '')[:50],
                'phone_number': user_data.get('phone_number', '')[:15],
                'marital_status': user_data.get('marital_status', '')[:50],
                'family_circumstance': user_data.get('family_circumstance', '')[:50],
                'community_status': user_data.get('community_status', '')[:50],
                'interests': user_data.get('interests', '')[:50],
                'personal_identity': user_data.get('personal_identity', '')[:50],
                'profile_photo' : flask.session['picture']
            }
            
            # Send user data to database for CREATE
            db.add_user(user_dict)
            
            # Return success after adding community
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database / not admin
        except Exception as ex:
            print(f'users.py: {str(ex)}')
            return flask.jsonify({
                'status' : 'error',
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'status' : 'error',
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
    
def update_user_data() -> tuple:
    """ Edit an already existing user's data

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Parse user data to be edited sent from frontend
            user_data = flask.request.json
            user_dict = {
                'first_name': user_data.get('first_name', '')[:50],
                'last_name': user_data.get('last_name', '')[:50],
                'email': user_data.get('email', '')[:50],
                'address': user_data.get('address', '')[:50],
                'preferred_name': user_data.get('preferred_name', 'N/A')[:50] if user_data.get('preferred_name') != '' else 'N/A',
                'pronouns': user_data.get('pronouns', 'N/A')[:50] if user_data.get('pronouns') != '' else 'N/A',
                'phone_number': user_data.get('phone_number', '')[:15],
                'marital_status': user_data.get('marital_status', 'N/A')[:50] if user_data.get('marital_status') != '' else 'N/A',
                'family_circumstance': user_data.get('family_circumstance', 'N/A')[:50] if user_data.get('family_circumstance') != '' else 'N/A',
                'community_status': user_data.get('community_status', 'N/A')[:50] if user_data.get('community_status') != '' else 'N/A',
                'interests': user_data.get('interests', 'N/A')[:50] if user_data.get('interests') != '' else 'N/A',
                'personal_identity': user_data.get('personal_identity', 'N/A')[:50] if user_data.get('personal_identity') != '' else 'N/A',
                'profile_photo' :  flask.session['picture']
            }
            
            # Send user data to database for UPDATE
            db.update_user(user_dict)
            
            # Return success after editing user's data
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'users.py: {str(ex)}')
            return flask.jsonify({
                'status' : 'error',
                'message': str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not authenticated.'
        }), 401 # UNAUTHORIZED

def delete_user_data() -> tuple:
    """ Delete a user

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Parse user to be deleted and send to database
            user_data = flask.request.json
            db.delete_user(user_data['email'])
            
            # Return success after deleting user
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'users.py: {str(ex)}')
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not Auth'
        }), 401 # UNAUTHORIZED
        
def get_blocked_users() -> tuple:
    """ Return all blocked users in Social Circles

    Returns:
        tuple: JSON containing blocked users and HTTP code
    """
    # Check if user is authenticated and has authorization to perform action
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):
        try:
            # Retrieve blocked users from database
            blocked_users = db.get_all_blocked_users()
            return flask.jsonify(blocked_users), 200  # OK
        # Error from database
        except Exception as ex:
            print(f'users.py: {str(ex)}')
            return flask.jsonify(
                {'status': 'error', 
                 'message': 'Failed to fetch blocked users'}), 500  # Internal Server Error
    else:
        return flask.jsonify(
            {'status': 'error', 
             'message': 'Unauthorized access'}), 403  # Forbidden
    

def block_and_delete_user() -> tuple:
    """ Block and delete a user from Social Circles

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    # Check if user is authenticated and has authorization to perform action
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):
        try:
            # Block and delete the user in the database
            user_data = flask.request.json
            user_email = user_data['email']  
            db.block_and_delete_user(user_email)
            
            # Return success after blocking and deleting user
            return flask.jsonify(
                {'status': 'success', 
                 'message': 'User has been blocked and deleted'
                }), 200
        # Error from database
        except Exception as ex:
            print(f'users.py: {str(ex)}')
            return flask.jsonify(
                {'status': 'error', 
                 'message': str(ex)}), 500  # Internal Server Error
    else:
        return flask.jsonify(
            {'status': 'error', 
             'message': 'Unauthorized access'}), 403  # Forbidden

def remove_user_from_block() -> tuple:
    """ Remove a user from the blocked users list

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    # Check if user is authenticated and has authorization to perform action
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):
        try:
            # Remove user from blocked users in the database
            user_data = flask.request.json
            db.remove_user_from_block(user_data['email'])
            return flask.jsonify(
                {'status': 'success', 
                 'message': 'User has been removed from the block'}), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'users.py: {str(ex)}')
            return flask.jsonify(
                {'status': 'error', 
                 'message': 'Failed to remove user from block'}), 500  # Internal Server Error
    else:
        return flask.jsonify(
            {'status': 'error', 
             'message': 'Unauthorized access'}), 403  # Forbidden
