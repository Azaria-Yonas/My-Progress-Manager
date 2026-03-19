from flask import Flask
import psycopg as pg
import supabase




def get_tasks(token):

    id = 0
    
    with pg.connect(
        host="db.guqkkaslkjwvbtpwmgjn.supabase.co",
        dbname="postgres",
        user="postgres",
        password="SupaSafePassword1738",
        port=5432,
    ) as conn:
        with conn.cursor() as curr:

            curr.execute("""
                Select title, color, due_date FROM tasks
                WHERE id = %s
            """)
            