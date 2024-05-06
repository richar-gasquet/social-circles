#----------------------------------------------------------------------
# resources.py: Flask methods for resources-related requests
#----------------------------------------------------------------------

import sys
import flask
import resources_queries as res_db
import user_queries as user_db

#----------------------------------------------------------------------

def get_resources() -> tuple:
    """ Return all available resources
        
    Returns:
        tuple: JSON containing resources and HTML code
    """
    
    try:
        # Fetch all resources from database
        all_resources = res_db.get_resources()
        resources_list = []
        
        # Prepare list of dicts containing all resources
        for resource in all_resources:
            resources_dict = {
                'resource_id': resource[0],
                'resource': resource[1],
                'disp_name': resource[2],
                'descrip': resource[3]
            }
            resources_list.append(resources_dict)
            
        # Return list of all resources
        return flask.jsonify({
            'results' : resources_list
        }), 200 # OK
    # Error from database
    except Exception as ex:
        print(f'resources.py: {str(ex)}')
        return flask.jsonify({
            'message' : str(ex)
        }), 500 # INTERNAL SERVER ERROR

def add_resources() -> tuple:
    """Add a resource

    Returns:
        tuple: JSON containing request status and HTML code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            
            # Parse resource data to add sent from frontend
            resource_data = flask.request.json
            resource_dict = {
                'resource' : resource_data['resource'],
                'disp_name' : resource_data['disp_name'],
                'descrip' : resource_data['descrip']
            }

            # Send resource data to database for CREATE
            res_db.add_resources(resource_dict)
                
            # Return success after adding resource
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database / not admin
        except Exception as ex:
            print(f'resources.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
        
def update_resources() -> tuple:
    """ Edit an already existing resource

    Returns:
        tuple: JSON containing request status and HTML code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            
            # Parse resource data to be edited sent from frontend
            resource_data = flask.request.json
            resource_dict = {
                'resource_id' : resource_data.get('resource_id',''),
                'resource' : resource_data.get('resource',''),
                'disp_name' : resource_data.get('disp_name',''),
                'descrip' : resource_data.get('descrip','')
            }

            # Send resource data to database for UPDATE
            res_db.update_resources(resource_dict)

            # Return success after editing resource
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database / not admin
        except Exception as ex:
            print(f'resources.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
    
def delete_resources() -> tuple:
    """ Delete a resource

    Returns:
        tuple: JSON containing request status and HTML code
    """
    
    # Check if user is authenticated
    if 'email' in flask.session:
        try:
            # Check if user is authorized to perform action
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            
            # Parse resource data to be deleted sent from frontend
            resource_data = flask.request.json
            resource_id = resource_data.get('resource_id')

            # Send resource data to database for DELETE
            res_db.delete_resources(resource_id)
                
            # Return success after deleting resource
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        # Error from database / not admin
        except Exception as ex:
            print(f'resources.py: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED