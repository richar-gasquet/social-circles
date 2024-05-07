#----------------------------------------------------------------------
# communities.py: Flask methods for community-related requests
#----------------------------------------------------------------------

import sys
import html
import flask
import community_queries as comm_db
import user_queries as user_db

#----------------------------------------------------------------------

def get_available_communities() -> tuple:
    """ Return all available communities and user's registration status
        for each one 
        
    Returns:
        tuple: JSON containing communities and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Fetch all communities from database
            email = flask.session['email']
            all_communities = comm_db.get_all_communities(email)
            communities_list = []
            
            # Prepare list of dicts containing all communities
            for community in all_communities:
                community_dict = {
                    'group_id' : community[0],
                    'name' : community[1],
                    'desc' : community[2],
                    'count' : community[3],
                    'image' : community[4],
                    'isRegistered' : community[5]
                }
                communities_list.append(community_dict)
                
            # Return list of all communities
            return flask.jsonify({
                'results' : communities_list
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'communities.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def get_registered_communities() -> tuple:
    """ Return all communities the user is registered for

    Returns:
        tuple: JSON containing communities and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Fetch all registered communities from database
            email = flask.session['email']
            reg_communities = comm_db.get_registered_communities(email)
            communities_list = []
            
             # Prepare list of dicts containing registered communities
            for community in reg_communities:
                community_dict = {
                    'group_id' : community[0],
                    'name' : community[1],
                    'desc' : community[2],
                    'count' : community[3],
                    'image' : community[4],
                    'isRegistered' : community[5]
                }
                communities_list.append(community_dict)
            # Return list of registered communities
            return flask.jsonify({
                'results' : communities_list
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'communities.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def add_community() -> tuple:
    """ Add a community

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            # Parse community data to add sent from frontend
            community_data = flask.request.json
            community_dict = {
                'group_name' : html.escape(community_data.get('name')),
                'group_desc' : html.escape(community_data.get('desc')),
                'image_link' : html.escape(community_data.get('image')) 
            }
            
            # Send community data to database for CREATE
            comm_db.add_community(community_dict)
            
            # Return success after adding community
            return flask.jsonify({
                'status' : 'success',
            }), 200 # OK
        # Error from database / not admin
        except Exception as ex:
            print(f'communities.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def edit_community() -> tuple:
    """ Edit an already existing community

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            # Parse community data to be edited sent from frontend
            community_data = flask.request.json
            community_dict = {
                'group_id' : community_data.get('group_id', ''),
                'group_name' : html.escape(community_data.get('name', '')),
                'group_desc' : html.escape(community_data.get('desc', '')),
                'image_link' : html.escape(community_data.get('image', ''))
            }
            
            # Send community data to database for UPDATE
            comm_db.update_community(community_dict)
            
            # Return success after editing community
            return flask.jsonify({
                'status' : 'success',
            }), 200 # OK
        # Error from database / not admin
        except Exception as ex:
            print(f'communities.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def delete_community() -> tuple:
    """ Delete a community

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            # Parse community data to be deleted sent from frontend
            community_data = flask.request.json
            group_id = community_data.get('group_id')
            
            # Send community data to database for DELETE
            comm_db.delete_community(group_id)
                
            # Return success after deleting community
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'communities.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def add_community_registration() -> tuple:
    """ Add a user to a community's membership

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Parse community data sent from frontend
            community_data = flask.request.json
            group_id = community_data.get('group_id')
            
            # Get user email
            email = flask.session['email']
            
            # Send community and user email to database for INSERT
            comm_db.add_community_registration(email, group_id)
                
            # Return success after registering user to the community
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'communities.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex) 
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def delete_community_registration() -> tuple:
    """ Voluntarily delete a user from a community's membership

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Parse community data sent from frontend
            community_data = flask.request.json
            group_id = community_data.get('group_id')
            
            # Get user email
            email = flask.session['email']
            
            # Send community ID and user email to database for DELETE
            comm_db.delete_community_registration(email, group_id)
                
            # Return success after removing user from the community
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'communities.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def get_community_emails() -> tuple:
    """ Return all user emails belonging to a particular community

    Returns:
        tuple: JSON containing emails and HTTP code
    """
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            
            # Parse community data sent from frontend
            community_data = flask.request.json
            group_id = community_data.get('group_id')
            
            # Send community data to database for READ
            emails_list = comm_db.get_community_emails(group_id)
            
            # Create and return string of user emails
            emails_str = ','.join(email[0] for email in emails_list)
            return flask.jsonify({
                'status' : 'success',
                'results' : emails_str
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'communities.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
    
def get_community_info() -> tuple:
    """ Return all details for a particular community

    Returns:
        tuple: JSON containing details and HTTP code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Parse URL parameters to determine which community to fetch for
            group_id = flask.request.args.get('group_id')
            if group_id is None:
                return flask.jsonify({
                    'message' : 'group_id parameter is missing in the URL.'
                }), 400 # BAD REQUEST
                
            # Validate that group_id is an integer
            try:
                group_id = int(group_id) 
            except ValueError:
                return flask.jsonify({
                    'message': 'Invalid input syntax for group_id. It must be an integer.'
                }), 404  # Not found
            
            # Send community ID to database for READ
            group_info = comm_db.get_community_info(group_id, flask.session['email'])
            
            if not group_info:
                return flask.jsonify({'results' : 'not found'}), 404 # NOT FOUND

            # Create dict containing community details
            group_info_dict = {
                'group_id' : group_info[0],
                'group_name': group_info[1],
                'group_desc': group_info[2],
                'count': group_info[3],
                'image_link': group_info[4],
                'isRegistered' : group_info[5]
            }
            
            # Return community details 
            return flask.jsonify({
                'results' : group_info_dict
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'communities.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
    
def remove_user() -> tuple:
    """ Forcefully remove a target user from a community's membership 

    Returns:
        tuple: JSON containing request status and HTTP code
    """
    # Check if user issuing request is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            
            # Get community details and target user's email
            group_data = flask.request.json
            group_id = group_data.get('group_id')
            email = group_data.get('email')

            # Send community ID and target user email to database for DELETE
            comm_db.delete_community_registration(email, group_id)
            
            # Return success after removing target user from the community
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'communities.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED

def get_users_for_community() -> tuple:
    """ Return all users belonging to a particular community

    Returns:
        tuple: JSON containing all users in a community and HTTP code
    """
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Parse URL parameters to determine which community to fetch for
            group_id = flask.request.args.get('group_id')
            if group_id is None:
                return flask.jsonify({
                    'message' : 'group_id parameter is missing in the URL.'
                }), 400 # BAD REQUEST
                
            # Validate that group_id is an integer
            try:
                group_id = int(group_id) 
            except ValueError:
                return flask.jsonify({
                    'message': 'Invalid input syntax for group_id. It must be an integer.'
                }), 404  # Not found
                
            # Send community ID to database for READ
            users = comm_db.get_users_for_community(group_id)
            
            # Create list of dicts containing users in community
            users_list = []
            for user in users:
                user_dict = {
                    'user_id' : user[0],
                    'first_name': user[1],
                    'last_name': user[2],
                    'email': user[3],
                    'is_admin': user[4],
                    'address': user[5],
                    'preferred_name': user[6],
                    'pronouns': user[7],
                    'phone_number': user[8],
                    'marital_status': user[9],
                    'family_circumstance': user[10],
                    'community_status': user[11],
                    'interests': user[12],
                    'personal_identity': user[13],
                    'profile_photo': user[14]
                }
                users_list.append(user_dict)

            # Return list of all users in the community
            return flask.jsonify({
                'results' : users_list
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'communities.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED