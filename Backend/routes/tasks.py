# routes/tasks.py
from flask import jsonify
from clients.psycopg_connect import psycopg_connect



def fecth_tasks(user_id):
    results = []
    with psycopg_connect() as conn:
        with conn.cursor() as curr:
            curr.execute("""
                SELECT id, title, description, due_date, color, order_index, is_completed FROM mydb.tasks
                WHERE user_id = %s AND is_completed = False
                ORDER BY order_index
            """,
            (user_id,)) 

            rows = curr.fetchall()

            for row in rows:
                results.append({
                    "id" : row[0],
                    "title": row[1],
                    "description": row[2],
                    "due_date": row[3],
                    "color": row[4],
                    "order_index" : row[5],
                    "is_completed": row[6]
                })

    return jsonify(results)


def create_task(user_id, title, description, color, due_date):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    INSERT INTO mydb.tasks (user_id, title, description, color, due_date)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                """,
                (user_id, title, description, color, due_date))

                row = curr.fetchone()
                if row is None:
                    raise Exception("Insert failed: no ID returned")

                task_id = row[0]
            
                return jsonify({
                    "id": task_id,
                    "title": title,
                    "description": description,
                    "color": color,
                    "due_date": due_date,
                    "is_completed": False
                })
    except Exception as e:
        return jsonify({"Error: ": e}), 400


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