# routes/tasks.py
from flask import jsonify
import psycopg as pg
from psycopg import sql
from clients.psycopg_connect import psycopg_connect




def fecth_tasks(user_id):
    results = []
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT id, title, is_completed, color, due_date, order_index 
                    FROM public.tasks
                    WHERE user_id = %s
                """,
                (user_id,)) 

                rows = curr.fetchall()

                for row in rows:
                    results.append({
                        "id": row[0], 
                        "title": row[1], 
                        "is_completed": row[2], 
                        "color": row[3], 
                        "due_date": row[4], 
                        "order_index": row[5] or 0
                    })
        return jsonify(results)
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400


    


def create_task(user_id, title, color, due_date):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    INSERT INTO public.tasks (user_id, title, color, due_date)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id
                """,
                (user_id, title, color, due_date))

                row = curr.fetchone()
                if row is None:
                    raise Exception("Insert failed: no ID returned")

                task_id = row[0]
            
                return jsonify({
                    "id": task_id,
                    "title": title,
                    "color": color,
                    "due_date": due_date,
                    "is_completed": False,
                    "order_index" : 0
                })
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400
    
def update_task(user_id, id, values):
    fields = ["title", "color", "due_date", "order_index", "is_completed"]
    updates = {field: values[field] for field in fields if field in values}
    if not updates:
        return jsonify({"Error": "No fields to update"}), 400
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                set_clause = sql.SQL(", ").join([sql.SQL("{} = %s").format(sql.Identifier(field)) for field in updates])
                curr.execute(sql.SQL("""
                    UPDATE public.tasks SET {}
                    WHERE id = %s AND user_id = %s
                    RETURNING id, user_id, title, is_completed, color, due_date, order_index
                """).format(set_clause),
                (*updates.values(), id, user_id))

                row = curr.fetchone()
                if row is None:
                    return jsonify({"Error": "Task not found"}), 404

                return jsonify({
                    "id": row[0],
                    "user_id": row[1],
                    "title": row[2],
                    "is_completed": row[3],
                    "color": row[4],
                    "due_date": row[5],
                    "order_index": row[6]
                })
    except pg.Error as e:
        return jsonify({"Error": str(e)}), 400
    
def delete_task(user_id, id):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    DELETE FROM public.tasks 
                    WHERE user_id = %s AND id = %s
                """,
                (user_id,id))
        return jsonify({"message": "Successfully Deleted Task"})
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400

def complete_task(user_id, id):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT id, user_id, title, color, due_date FROM public.tasks
                    WHERE id = %s AND user_id = %s
                """,
                (id, user_id))
                task = curr.fetchone()
                if task is None:
                    return jsonify({"Error": "Task not found"}), 404
                
                curr.execute("""
                    INSERT INTO public.completed_tasks (id, user_id, title, color, due_date)
                    VALUES (%s, %s, %s, %s, %s);
                """,
                task)

                curr.execute("""
                    DELETE FROM public.tasks 
                    WHERE id = %s AND user_id = %s
                """,
                (id, user_id))
        return jsonify({"message": "Successfully Completed Task"})
    except pg.Error as e:
        return jsonify({"Error": str(e)}), 400
    
def undo_complete_task(user_id, id):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT id, user_id, title, color, due_date FROM public.completed_tasks
                    WHERE id = %s AND user_id = %s
                """,
                (id, user_id))
                task = curr.fetchone()

                if task is None:
                    return jsonify({"Error": "Completed task not found"}), 404

                curr.execute("""
                    INSERT INTO public.tasks (id, user_id, title, color, due_date)
                    VALUES (%s, %s, %s, %s, %s);
                """,
                task)

                curr.execute("""
                    DELETE FROM public.completed_tasks
                    WHERE id = %s AND user_id = %s
                """,
                (id, user_id))
        return jsonify({"message": "Successfully restored task"}), 200
    except pg.Error as e:
        return jsonify({"Error": str(e)}), 400

def reorder_tasks(user_id, tasks):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.executemany("""
                    UPDATE public.tasks SET order_index = %s
                    WHERE id = %s AND user_id = %s
                """,
                [(task["order_index"], task["id"], user_id) for task in tasks])
        return "", 200
    except pg.Error as e:
        return jsonify({"Error": str(e)}), 400 
    