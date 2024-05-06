#----------------------------------------------------------------------
# resources_queries.py: SQL Queries for Social Circles Resources
#----------------------------------------------------------------------

import psycopg2
from database import get_connection, put_connection

#----------------------------------------------------------------------

def get_resources() -> list:
    """ Get all resources from the database

    Returns:
        list: list of lists containing all resources' details
    """
    all_resources = []
    connection = get_connection()
    try: 
        with connection.cursor() as cursor: 
            # Retrieve all resources
            cursor.execute('''
                SELECT *
                FROM resources
            ''')
            all_resources = cursor.fetchall()
    # Database error
    except Exception:
        raise
    finally:
        put_connection(connection)
        
    return all_resources

def add_resources(args: dict) -> None:
    """ Add a resource to the database

    Args:
        args (dict): Dict containing details of resources to be added
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Extract resources details to be added
            resource = args.get('resource')
            disp_name = args.get('disp_name')
            descrip = args.get('descrip')
            
            values = (resource, disp_name, descrip)
            
            # Insert resource into 'resources' table
            cursor.execute('''
                INSERT INTO 
                    resources (resource_id, resource,
                                disp_name, descrip)
                VALUES
                    (DEFAULT, %s, %s, %s)              
            ''', values)
            
            connection.commit()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)

def update_resources(args: dict) -> None:
    """ Edit a resource in the database

    Args:
        args (dict): Dict containing details of resource to be edited
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Extract resources' details to be edited
            resource_id = args.get('resource_id')
            resource = args.get('resource')
            disp_name = args.get('disp_name')
            descrip = args.get('descrip')
            
            # Edit resource only for updated fields
            sql_query_base = "UPDATE resources SET "
            values = []
            if resource:
                sql_query_base += "resource = %s, "
                values.append(resource)
            if disp_name:
                sql_query_base += "disp_name = %s, "
                values.append(disp_name)
            if descrip:
                sql_query_base += "descrip = %s, "
                values.append(descrip)

            sql_query_base = sql_query_base[:-2]
            sql_query_base += " WHERE resource_id = %s"
            values.append(resource_id)

            cursor.execute(sql_query_base, tuple(values))
            connection.commit()
    # Database error
    except Exception:
        connection.rollback()
        raise
    finally:
        put_connection(connection)
        
def delete_resources(resource_id: int) -> None:
    """ Delete a resource from the database

    Args:
        resource_id (int): ID of the resource to be deleted
    """
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                DELETE FROM
                    resources 
                WHERE 
                    resource_id = %s
            ''', (resource_id, ))
            connection.commit()
    # Database error
    except Exception as ex:
        connection.rollback()
        raise
    finally:
        put_connection(connection)