#----------------------------------------------------------------------
# vistor_queries.py: SQL Queries for Social Circles Vistors_log
#----------------------------------------------------------------------
import psycopg2
from database import get_connection, put_connection

def log_visit(session_id):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO visitor_logs (session_id) VALUES (%s)", (session_id,))
            connection.commit()
    except Exception:
        raise
    finally:
        put_connection(connection)

def current_visitors():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(DISTINCT session_id) FROM visitor_logs WHERE timestamp > (CURRENT_TIMESTAMP - INTERVAL '24 hours')")
            count = cursor.fetchone()[0]
    except Exception:
        raise
    finally:
        put_connection(connection)
        
    return {'current_visitors': count}



def delete_expired_sessions_from_database():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM visitor_logs WHERE timestamp < CURRENT_TIMESTAMP")
            connection.commit()
    except Exception:
        raise
    finally:
        put_connection(connection)