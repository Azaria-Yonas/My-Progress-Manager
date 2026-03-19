import psycopg as pg
from config import DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER


def psycopg_cursor():
    return  pg.connect(
        host = DB_HOST,
        dbname = DB_NAME,
        user = DB_USER,
        password = DB_PASSWORD,
        port = DB_PORT,
    )