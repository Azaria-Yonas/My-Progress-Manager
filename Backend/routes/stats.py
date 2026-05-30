from flask import jsonify
import psycopg as pg
from clients.psycopg_connect import psycopg_connect


def tasks_analytics(id):
    results = []
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT id, title, color, due_date, completed_at FROM public.completed_tasks
                    WHERE user_id = %s
                """,
                (id,))

                
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
        return jsonify({"Error: ": str(e)})
        


def streaks_analytics(id):
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
                (id,))

                
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
        return jsonify({"Error: ": str(e)})
    