import os
import queue
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.environ.get('DATABASE_URL')

#----------------------------------------------------------------------

# Create Connection Pooling Functionality
_connection_pool = queue.Queue(maxsize=15)

def get_connection():
    try:
        return _connection_pool.get_nowait()
    except queue.Empty:
        return psycopg2.connect(DATABASE_URL)

def put_connection(conn):
    try:
        _connection_pool.put_nowait(conn)
    except queue.Full:
        conn.close()