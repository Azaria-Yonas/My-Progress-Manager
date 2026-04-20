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


def create_task(id, title, description, color, created_at, due_date):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    INSERT INTO mydb.tasks (id, title, description, color, created_at, due_date)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (id, title, description, color, created_at, due_date))
                return jsonify({"Task Successfully Created"})
    except Exception as e:
        return jsonify({"Error: ": e})


def update_task(id, **values):
    def unravel(kwargs):
        values = ""
        for k, v in kwargs:
            values += f"{k} = {v},"
        return values

    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    UPDATE mydb.tasks SET %s 
                    WHERE id = %s
                """,
                (id,unravel(kwargs=values)))
    except Exception as e:
        return jsonify({"Error: ", e})
     

def delete_task(id):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    DELETE FROM mydb.tasks WHERE id = %s
                """,
                (id,))
        return jsonify ({"Successfully Deleted Task"})
    except Exception as e:
        return jsonify({"Error: ": e})

def complete_task(id):
    # Update task
    # Copy Paste to Completed Task
    # Delete Task
    return jsonify({"Hello"})