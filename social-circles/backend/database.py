#----------------------------------------------------------------------
# database.py: Database pooling for all SQL queries
#----------------------------------------------------------------------

import os
import queue
import psycopg2
from dotenv import load_dotenv

#----------------------------------------------------------------------

load_dotenv()
DATABASE_URL = os.environ.get('DATABASE_URL')

# Create Connection Pooling Functionality
_connection_pool = queue.Queue(maxsize=15)

def get_connection():
    """ Retrieve connection from queue or create a new one

    Returns:
        psycopg2.connection: New/existing connection to the database
    """
    try:
        return _connection_pool.get_nowait()
    except queue.Empty:
        return psycopg2.connect(DATABASE_URL)

def put_connection(conn) -> None:
    """ Put connection back into the queue or close it if queue is full

    Args:
        conn (psycopg2.connection): Existing connection to the database
    """
    try:
        _connection_pool.put_nowait(conn)
    except queue.Full:
        conn.close()