# routes/tasks.py
from flask import jsonify
from clients.psycopg_connect import psycopg_connect



def fecth_tasks(user_id):
    results = []
    with psycopg_connect() as conn:
        with conn.cursor() as curr:
            curr.execute("""
                SELECT title, description, due_date, color, id, order_index, is_compeleted FROM mydb.tasks
                WHERE user_id = %s
                ORDER BY order_index
            """,
            (user_id,)) 

            rows = curr.fetchall()

            for row in rows:
                results.append({
                    "title": row[0],
                    "description": row[1],
                    "due_date": row[2],
                    "color": row[3],
                    "id" : row[4],
                    "order_index": row[5],
                    "is_completed": row[6]
                })

    return jsonify(results)