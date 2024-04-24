import sys
import flask
import resources_queries as res_db
import user_queries as user_db

def get_resources():
    if 'email' in flask.session:
        try:
            all_resources = res_db.get_resources()
            resources_list = []
            
            for resource in all_resources:
                resources_dict = {
                    'resource_id': resource[0],
                    'image': resource[1],
                    'resource': resource[2],
                    'disp_name': resource[3],
                    'descrip': resource[4],
                }
                resources_list.append(resources_dict)
                
            return flask.jsonify({
                'results' : resources_list
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED

def add_resources():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            resource_data = flask.request.json

            resource_dict = {
                'image' : resource_data['image'],
                'resource' : resource_data['resource'],
                'disp_name' : resource_data['disp_name'],
                'descrip' : resource_data['descrip']
            }

            res_db.add_resources(resource_dict)
                
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED
    
def delete_resources():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            resource_data = flask.request.json
            resource_id = resource_data.get('resource_id')

            res_db.delete_resources(resource_id)
                
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED

def update_resources():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            resource_data = flask.request.json

            resource_dict = {
                'resource_id' : resource_data['resource_id'],
                'image' : resource_data['image'],
                'resource' : resource_data['resource'],
                'disp_name' : resource_data['disp_name'],
                'descrip' : resource_data['descrip']
            }

            res_db.update_resources(resource_dict)
                
            return flask.jsonify({
                'status' : 'success'
            }), 200 # OK
        except Exception as ex:
            print(f'{sys.argv[0]}: {str(ex)}')
            return flask.jsonify({
                'message' : str(ex)
            }), 500 # INTERNAL SERVER ERROR
    else:
        return flask.jsonify({
            'message' : 'User not authenticated.'
        }), 401 # UNAUTHORIZED