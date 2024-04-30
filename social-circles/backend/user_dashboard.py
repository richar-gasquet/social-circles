import sys
import flask
import user_dashboard_queries as userdash_db
import user_queries as user_db

def get_announcements():
    try:
        all_announcements = userdash_db.get_announcements()
        announcements_list = []
        
        for announcement in all_announcements:
            announcement_dict = {
                'announcement_id': announcement[0],
                'announcement_name': announcement[1],
                'description': announcement[2],
                'image_link' : announcement[3]
            }
            announcements_list.append(announcement_dict)
            
        return flask.jsonify({
            'results' : announcements_list
        }), 200 # OK
    except Exception as ex:
        print(f'{sys.argv[0]}: {str(ex)}')
        return flask.jsonify({
            'message' : str(ex)
        }), 500 # INTERNAL SERVER ERROR

def add_announcement():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            announcement_data = flask.request.json

            announcement_dict = {
                'announcement_name' : announcement_data['announcement_name'],
                'description' : announcement_data['description'],
                'image_link' :announcement_data['image_link']
            }

            userdash_db.add_announcement(announcement_dict)
                
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
    
def delete_announcement():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            announcement_data = flask.request.json
            announcement_id = announcement_data.get('announcement_id')

            userdash_db.delete_announcement(announcement_id)
                
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

def update_announcement():
    if 'email' in flask.session:
        try:
            is_admin = user_db.get_user_authorization(flask.session['email'])
            if not is_admin:
                raise Exception("User is not authorized!")
            announcement_data = flask.request.json

            announcement_dict = {
                'announcement_id' : announcement_data.get('announcement_id',''),
                'announcement_name' : announcement_data.get('announcement_name',''),
                'description' : announcement_data.get('description',''),
                'image_link' : announcement_data.get('image_link', '')
            }

            userdash_db.update_announcement(announcement_dict)
                
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