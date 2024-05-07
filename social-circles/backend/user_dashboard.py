#----------------------------------------------------------------------
# communities.py: Flask methods for user dashboard-related requests
#----------------------------------------------------------------------

import sys
import html
import flask
import user_dashboard_queries as userdash_db
import user_queries as user_db

#----------------------------------------------------------------------

def get_announcements() -> tuple:
    """ Return all announcements

    Returns:
        tuple: JSON containing announcements and HTTP code
    """
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Fetch all announcements from database
            all_announcements = userdash_db.get_announcements()
            announcements_list = []
            
            # Prepare list of dicts containing all announcements
            for announcement in all_announcements:
                announcement_dict = {
                    'announcement_id': announcement[0],
                    'announcement_name': announcement[1],
                    'description': announcement[2],
                    'image_link' : announcement[3]
                }
                announcements_list.append(announcement_dict)
                
            # Return list of all annnouncements
            return flask.jsonify({
                'results' : announcements_list
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'user_dashboard.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED

def add_announcement() -> tuple:
    """ Add an announcement


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
            
            # Parse announcement data to add sent from frontend
            announcement_data = flask.request.json
            announcement_dict = {
                'announcement_name' : html.escape(announcement_data['announcement_name']),
                'description' : html.escape(announcement_data['description']),
                'image_link' : html.escape(announcement_data['image_link'])
            }

            # Send announcement data to database for CREATE
            userdash_db.add_announcement(announcement_dict)
            
            # Return success after adding announcement
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database
        except Exception as ex:
            print(f'user_dashboard.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED

def update_announcement() -> tuple:
    """ Edit an already existing announcement

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
            
            # Parase announcement data to be edited sent from frontend
            announcement_data = flask.request.json
            announcement_dict = {
                'announcement_id' : announcement_data.get('announcement_id',''),
                'announcement_name' : html.escape(announcement_data.get('announcement_name','')),
                'description' : html.escape(announcement_data.get('description','')),
                'image_link' : html.escape(announcement_data.get('image_link', ''))
            }

            # Send announcement data to database for UPDATE
            userdash_db.update_announcement(announcement_dict)
                
            # Return success after editing announcement
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database / ot admin
        except Exception as ex:
            print(f'user_dashboard.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def delete_announcement() -> tuple:
    """ Delete an announcement
    
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
            
            # Parse announcement data to be deleted sent from frontend
            announcement_data = flask.request.json
            announcement_id = announcement_data.get('announcement_id')

            # Send announcement data to database for DELETE
            userdash_db.delete_announcement(announcement_id)
                
            # Return success after deleting announcement
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Database error
        except Exception as ex:
            print(f'user_dashboard.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED