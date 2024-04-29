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
                'group_name' : html.escape(community_data.get('name')),
                'group_desc' : html.escape(community_data.get('desc')),
                'image_link' : html.escape(community_data.get('image')) 
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
                'group_name' : html.escape(community_data.get('name', '')),
                'group_desc' : html.escape(community_data.get('desc', '')),
                'image_link' : html.escape(community_data.get('link', ''))
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
    
# def get_one_group_info():
#     if 'email' in flask.session:
#         try:
#             group_id = flask.request.args.get('group_id')
#             if group_id is None:
#                 return flask.jsonify({
#                     'message' : 'group_id parameter is missing in the URL.'
#                 }), 400 # BAD REQUEST
#             event_info = comm_db.get_one_group_info(group_id)

#             event_info_dict = {
#                 'event_name': event_info[1],
#                 'capacity': event_info[2],
#                 'filled_spots': event_info[3],
#                 'event_desc': event_info[4],
#                 'image_link': event_info[5],
#                 'start_time': event_info[6],
#                 'end_time': event_info[7],
#                 'location': event_info[8],
#                 'is_dana_event': event_info[9]
#             }

#             return flask.jsonify({
#                 'results' : event_info_dict
#             }), 200 # OK
#         except Exception as ex:
#             print(f'events.py: {str(ex)}')
#             return flask.jsonify({
#                 'message' : str(ex)
#             }), 500 # INTERNAL SERVER ERROR
#     else:
#         return flask.jsonify({
#             'message' : 'User not authenticated.'
#         }), 401 # UNAUTHORIZED
    
# def remove_user():
#     if 'email' in flask.session:
#         try:
#             event_data = flask.request.json
#             event_id = event_data.get('group_id')
#             email = event_data.get('email')

#             comm_db.delete_event_registration(email, event_id)
#             return flask.jsonify({
#                 'status' : 'success'
#             }), 200 # OK
#         except Exception as ex:
#             print(f'events.py: {str(ex)}')
#             return flask.jsonify({
#                 'message' : str(ex)
#             }), 500 # INTERNAL SERVER ERROR
#     else:
#         return flask.jsonify({
#             'message' : 'User not authenticated.'
#         }), 401 # UNAUTHORIZED

# def get_users_for_group():
#     if 'email' in flask.session:
#         try:
#             event_id = flask.request.args.get('event_id')
#             if event_id is None:
#                 return flask.jsonify({
#                     'message' : 'event_id parameter is missing in the URL.'
#                 }), 400 # BAD REQUEST
#             users = event_db.get_users_for_event(event_id)
#             users_list = []
#             for user in users:
#                 user_dict = {
#                     'user_id' : user[0],
#                     'first_name': user[1],
#                     'last_name': user[2],
#                     'email': user[3],
#                     'is_admin': user[4],
#                     'address': user[5],
#                     'preferred_name': user[6],
#                     'pronouns': user[7],
#                     'phone_number': user[8],
#                     'marital_status': user[9],
#                     'family_circumstance': user[10],
#                     'community_status': user[11],
#                     'interests': user[12],
#                     'personal_identity': user[13],
#                     'profile_photo': user[14]
#                 }
#                 users_list.append(user_dict)

#             return flask.jsonify({
#                 'results' : users_list
#             }), 200 # OK
#         except Exception as ex:
#             print(f'events.py: {str(ex)}')
#             return flask.jsonify({
#                 'message' : str(ex)
#             }), 500 # INTERNAL SERVER ERROR