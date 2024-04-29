import flask
import user_queries as db

def get_user_data():
    # Check if user is logged on server-side
    if 'email' in flask.session:
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

def add_user_data():
    if 'email' in flask.session:
        try:
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
            db.add_user(user_dict)
            return flask.jsonify({
                'status' : 'success'
            }), 200
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not Auth'
        }), 401 # unauthorized
    

def update_user_data():
    if 'email' in flask.session:
        try:
            
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
            
            db.update_user(user_dict)
            return flask.jsonify({
                'status' : 'success'
            }), 200
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not Auth'
        }), 401 # unauthorized
    

def delete_user_data():
    if 'email' in flask.session:
        try:
            user_data = flask.request.json
            db.delete_user(user_data['email'])
            return flask.jsonify({
                'status' : 'success'
            }), 200
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': str(ex)
            }), 500 # internal server error
    else:
        return flask.jsonify({
            'status' : 'error',
            'message': 'User not Auth'
        }), 401 # unauthorized
    

def get_all_users():
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):  # Check if user is logged in and is authorized
        try:
            all_user_details = db.get_all_user_details()
            return flask.jsonify(all_user_details), 200  # OK
        except Exception as ex:
            print(ex)
            return flask.jsonify({
                'status': 'error',
                'message': 'Failed to fetch user data'
            }), 500  # Internal Server Error
    else:
        return flask.jsonify({
            'status': 'error',
            'message': 'Unauthorized access'
        }), 403  # Forbidden
    

def block_and_delete_user_route():
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):
        # Check if the session user is an admin or has appropriate permissions
        try:
            user_data = flask.request.json
            user_email = user_data['email']  # Email of the user to be blocked and deleted

            db.block_and_delete_user(user_email)
            return flask.jsonify({'status': 'success', 'message': 'User has been blocked and deleted'}), 200
        except Exception as ex:
            return flask.jsonify({'status': 'error', 'message': str(ex)}), 500  # Internal Server Error
    else:
        return flask.jsonify({'status': 'error', 'message': 'Unauthorized access'}), 403  # Forbidden
    

def get_blocked_users():
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):
        try:
            blocked_users = db.get_all_blocked_users()
            return flask.jsonify(blocked_users), 200  # OK
        except Exception as ex:
            print(ex)
            return flask.jsonify({'status': 'error', 'message': 'Failed to fetch blocked users'}), 500  # Internal Server Error
    else:
        return flask.jsonify({'status': 'error', 'message': 'Unauthorized access'}), 403  # Forbidden


def remove_user_from_block():
    if 'email' in flask.session and db.get_user_authorization(flask.session['email']):
        try:
            user_data = flask.request.json
            db.remove_user_from_block(user_data['email'])
            return flask.jsonify({'status': 'success', 'message': 'User has been removed from the block'}), 200
        except Exception as ex:
            print(ex)
            return flask.jsonify({'status': 'error', 'message': 'Failed to remove user from block'}), 500  # Internal Server Error
    else:
        return flask.jsonify({'status': 'error', 'message': 'Unauthorized access'}), 403  # Forbidden
