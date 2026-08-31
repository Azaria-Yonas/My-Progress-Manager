import psycopg as pg
from psycopg import sql 
from psycopg.types.json import Jsonb
from clients.psycopg_connect import psycopg_connect
import json



def tasks_analytics(user_id):
    results = []
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT id, title, color, due_date, completed_at FROM public.completed_tasks
                    WHERE user_id = %s
                """,
                (user_id,))

                
                rows = curr.fetchall()

                for row in rows:
                    results.append({
                        "id": row[0], 
                        "title": row[1], 
                        "color": row[2], 
                        "due_date": row[3], 
                        "completed_at": row[4]
                    })
        return results
    except pg.Error as e:
        return ({"Error: ": str(e)})
        


def streaks_analytics(user_id):
    results = []
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT id, title, streak_count, duration_seconds, created_at, completed_at, 
                             total_intervals, successful_intervals, failed_intervals, calendar_data
                    FROM public.completed_streaks
                    WHERE user_id = %s
                """,
                (user_id,))

                
                rows = curr.fetchall()

                for row in rows:
                    results.append({
                        "id": row[0],
                        "title": row[1],
                        "streak_count": row[2],
                        "duration_seconds": row[3],
                        "created_at": row[4],
                        "completed_at": row[5],
                        "total_intervals": row[6],
                        "successful_intervals": row[7],
                        "failed_intervals": row[8],
                        "calendar_data": row[9]
                    })
        return results
    except pg.Error as e:
        return {"Error: ": str(e)} 




def fecth_streaks(user_id):
    results = []
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT id, user_id, title, duration_seconds, cooldown_end, created_at, updated_at, streak_count, last_tap_at, paused
                    FROM public.streaks
                    WHERE user_id = %s
                """,
                (user_id,))

                rows = curr.fetchall()

                for row in rows:
                    results.append({
                        "id": row[0],
                        "user_id": row[1],
                        "title": row[2],
                        "duration_seconds": row[3],
                        "cooldown_end": row[4],
                        "created_at": row[5],
                        "updated_at": row[6],
                        "streak_count": row[7],
                        "last_tap_at": row[8],
                        "paused": row[9]
                    })
        return results
    except pg.Error as e:
        return {"Error: ": str(e)}, 400


def create_streak(user_id, title, duration_seconds):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    INSERT INTO public.streaks (user_id, title, duration_seconds)
                    VALUES (%s, %s, %s)
                    RETURNING id, created_at
                """,
                (user_id, title, duration_seconds))

                row = curr.fetchone()
                if row is None:
                    raise Exception("Error")

                streak_id, created_at = row

                return {
                    "id": streak_id,
                    "user_id": user_id,
                    "title": title,
                    "duration_seconds": duration_seconds,
                    "cooldown_end": None,
                    "created_at": created_at,
                    "updated_at": None,
                    "streak_count": 0,
                    "last_tap_at": None,
                    "paused": False
                }
    except pg.Error as e:
        return {"Error: ": str(e)}, 400


def update_streak(user_id, id, values):
    fields = ["title", "duration_seconds", "cooldown_end", "streak_count", "last_tap_at", "paused"]
    updates = {field: values[field] for field in fields if field in values}
    if not updates:
        return {"Error": "No fields to update"}, 400
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                set_clause = sql.SQL(", ").join([sql.SQL("{} = %s").format(sql.Identifier(field)) for field in updates])
                curr.execute(sql.SQL("""
                    UPDATE public.streaks SET {}, updated_at = NOW()
                    WHERE id = %s AND user_id = %s
                    RETURNING id, user_id, title, duration_seconds, cooldown_end, created_at, updated_at, streak_count, last_tap_at, paused
                """).format(set_clause),
                (*updates.values(), id, user_id))

                row = curr.fetchone()
                if row is None:
                    return {"Error": "Streak not found"}, 404

                return {
                    "id": row[0],
                    "user_id": row[1],
                    "title": row[2],
                    "duration_seconds": row[3],
                    "cooldown_end": row[4],
                    "created_at": row[5],
                    "updated_at": row[6],
                    "streak_count": row[7],
                    "last_tap_at": row[8],
                    "paused": row[9]
                }
    except pg.Error as e:
        return {"Error": str(e)}, 400


def delete_streak(user_id, id):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    DELETE FROM public.streaks
                    WHERE user_id = %s AND id = %s
                """,
                (user_id,id))
        return {"message": "Successfully Deleted Streak"}
    except pg.Error as e:
        return {"Error: ": str(e)}, 400


def tap_streak(user_id, id):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    UPDATE public.streaks
                    SET streak_count = streak_count + 1,
                        last_tap_at = NOW(),
                        cooldown_end = NOW() + make_interval(secs => duration_seconds),
                        updated_at = NOW()
                    WHERE id = %s AND user_id = %s
                    RETURNING id, user_id, title, duration_seconds, cooldown_end, created_at, updated_at, streak_count, last_tap_at, paused
                """,
                (id, user_id))

                row = curr.fetchone()
                if row is None:
                    return {"Error": "Streak not found"}, 404

                return {
                    "id": row[0],
                    "user_id": row[1],
                    "title": row[2],
                    "duration_seconds": row[3],
                    "cooldown_end": row[4],
                    "created_at": row[5],
                    "updated_at": row[6],
                    "streak_count": row[7],
                    "last_tap_at": row[8],
                    "paused": row[9]
                }
    except pg.Error as e:
        return {"Error": str(e)}, 400


def expire_streak(user_id, id):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    UPDATE public.streaks
                    SET streak_count = 0,
                        cooldown_end = NULL,
                        last_tap_at = NULL,
                        updated_at = NOW()
                    WHERE id = %s AND user_id = %s
                    RETURNING id, user_id, title, duration_seconds, cooldown_end, created_at, updated_at, streak_count, last_tap_at, paused
                """,
                (id, user_id))

                row = curr.fetchone()
                if row is None:
                    return {"Error": "Streak not found"}, 404

                return {
                    "id": row[0],
                    "user_id": row[1],
                    "title": row[2],
                    "duration_seconds": row[3],
                    "cooldown_end": row[4],
                    "created_at": row[5],
                    "updated_at": row[6],
                    "streak_count": row[7],
                    "last_tap_at": row[8],
                    "paused": row[9]
                }
    except pg.Error as e:
        return {"Error": str(e)}, 400


def pause_streak(user_id, id, paused):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    UPDATE public.streaks
                    SET paused = %s,
                        updated_at = NOW()
                    WHERE id = %s AND user_id = %s
                    RETURNING id, user_id, title, duration_seconds, cooldown_end, created_at, updated_at, streak_count, last_tap_at, paused
                """,
                (paused, id, user_id))

                row = curr.fetchone()
                if row is None:
                    return {"Error": "Streak not found"}, 404

                return {
                    "id": row[0],
                    "user_id": row[1],
                    "title": row[2],
                    "duration_seconds": row[3],
                    "cooldown_end": row[4],
                    "created_at": row[5],
                    "updated_at": row[6],
                    "streak_count": row[7],
                    "last_tap_at": row[8],
                    "paused": row[9]
                }
    except pg.Error as e:
        return {"Error": str(e)}, 400


def complete_streak(user_id, id, total_intervals, successful_intervals, failed_intervals, calendar_data):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT id, user_id, title, streak_count, duration_seconds, created_at FROM public.streaks
                    WHERE id = %s AND user_id = %s
                """,
                (id, user_id))
                streak = curr.fetchone()
                if streak is None:
                    return {"Error": "Streak not found"}, 404

                curr.execute("""
                    INSERT INTO public.completed_streaks (id, user_id, title, streak_count, duration_seconds, created_at, total_intervals, successful_intervals, failed_intervals, calendar_data)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                """,
                (*streak, total_intervals, successful_intervals, failed_intervals, Jsonb(calendar_data)))

                curr.execute("""
                    DELETE FROM public.streaks
                    WHERE id = %s AND user_id = %s
                """,
                (id, user_id))
        return {"message": "Successfully Completed Streak"}
    except pg.Error as e:
        return {"Error": str(e)}, 400
    




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
        return results
    except pg.Error as e:
        return {"Error: ": str(e)}, 400


    


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
            
                return {
                    "id": task_id,
                    "title": title,
                    "color": color,
                    "due_date": due_date,
                    "is_completed": False,
                    "order_index" : 0
                }
    except pg.Error as e:
        return {"Error: ": str(e)}, 400


    
def update_task(user_id, id, values):
    fields = ["title", "color", "due_date", "order_index", "is_completed"]
    updates = {field: values[field] for field in fields if field in values}
    if not updates:
        return {"Error": "No fields to update"}, 400
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
                    return {"Error": "Task not found"}, 404

                return {
                    "id": row[0],
                    "user_id": row[1],
                    "title": row[2],
                    "is_completed": row[3],
                    "color": row[4],
                    "due_date": row[5],
                    "order_index": row[6]
                }
    except pg.Error as e:
        return {"Error": str(e)}, 400


    
def delete_task(user_id, id):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    DELETE FROM public.tasks 
                    WHERE user_id = %s AND id = %s
                """,
                (user_id,id))
        return {"message": "Successfully Deleted Task"}
    except pg.Error as e:
        return {"Error: ": str(e)}, 400


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
                    return {"Error": "Task not found"}, 404
                
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
        return {"message": "Successfully Completed Task"}
    except pg.Error as e:
        return {"Error": str(e)}, 400


    
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
                    return {"Error": "Completed task not found"}, 404

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
        return {"message": "Successfully restored task"}, 200
    except pg.Error as e:
        return {"Error": str(e)}, 400

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
        return {"Error": str(e)}, 400 
    



def ask_user(question: str, wb, queue):

    wb.send(question)

    user_response = queue.listen()

    return user_response



def wakeup_orchestrator():
    return "Orchestrator Not Available "






TOOLS = {
    "get_tasks_analytics": {"function": tasks_analytics,"user_id": True},
    "get_streaks_analytics": {"function": streaks_analytics,"user_id": True},
    "fetch_streaks": {"function": fecth_streaks,"user_id": True},
    "create_streak": {  "function": create_streak,"user_id": True},
    "update_streak": { "function": update_streak,"user_id": True},
    "delete_streak": {"function": delete_streak,"user_id": True},
    "tap_streak": {"function": tap_streak,"user_id": True},
    "expire_streak": { "function": expire_streak,"user_id": True},
    "pause_streak": { "function": pause_streak,"user_id": True},
    "complete_streak": { "function": complete_streak,"user_id": True},   
     "fetch_tasks": {"function": fecth_tasks,"user_id": True},
    "create_task": {"function": create_task,"user_id": True},
    "update_task": {"function": update_task,"user_id": True},
    "delete_task": { "function": delete_task,"user_id": True },
    "complete_task": {"function": complete_task,"user_id": True},
    "undo_complete_task": {"function": undo_complete_task,"user_id": True},
    "reorder_tasks": {"function": reorder_tasks,"user_id": True},
    "ask_user": { "function": ask_user,"user_id": False},
    "wakeup_orchestrator": {"function": wakeup_orchestrator,"user_id": False}
}











def get_tools(path):
    with open(path, "r") as f:
        return json.load(f)










    
