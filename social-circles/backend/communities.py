import sys
import html
import flask
import community_queries as comm_db
import user_queries as user_db

def get_available_communities():
    if 'email' in flask.session:
        try:
            email = flask.session['email']
            all_communities = comm_db.get_all_communities(email)
            communities_list = []
            
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
                
            return flask.jsonify({
                'results' : communities_list
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
        
def get_registered_communities():
    if 'email' in flask.session:
        try:
            email = flask.session['email']
            reg_communities = comm_db.get_registered_communities(email)
            communities_list = []
            
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
                
            return flask.jsonify({
                'results' : communities_list
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
        
def add_community():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            community_data = flask.request.json
            community_dict = {
                'group_name' : html.escape(community_data.get('group_name')),
                'group_desc' : html.escape(community_data.get('group_desc')),
                'image_link' : html.escape(community_data.get('image_link')) 
            }
            
            comm_db.add_community(community_dict)
            return flask.jsonify({
                'status' : 'success',
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
        
def edit_community():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            community_data = flask.request.json
            community_dict = {
                'group_id' : community_data.get('group_id', ''),
                'group_name' : html.escape(community_data.get('group_name', '')),
                'group_desc' : html.escape(community_data.get('group_desc', '')),
                'image_link' : html.escape(community_data.get('image_link', ''))
            }
            
            comm_db.update_community(community_dict)
            return flask.jsonify({
                'status' : 'success',
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
        
def delete_community():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")

            community_data = flask.request.json
            group_id = community_data.get('group_id')
            
            comm_db.delete_community(group_id)
                
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
        
def add_community_registration():
    if 'email' in flask.session:
        try:
            community_data = flask.request.json
            group_id = community_data.get('group_id')
            
            email = flask.session['email']
            
            comm_db.add_community_registration(email, group_id)
                
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
        
def delete_community_registration():
    if 'email' in flask.session:
        try:
            community_data = flask.request.json
            group_id = community_data.get('group_id')
            
            email = flask.session['email']
            
            comm_db.delete_community_registration(email, group_id)
                
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
        
def get_community_emails():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            
            community_data = flask.request.json
            group_id = community_data.get('group_id')
            
            emails_list = comm_db.get_community_emails(group_id)
            emails_str = ','.join(email[0] for email in emails_list)
            return flask.jsonify({
                'status' : 'success',
                'results' : emails_str
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