from flask import jsonify
import psycopg as pg
from clients.psycopg_connect import psycopg_connect


def tasks_analytics(id):
    results = []
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT id, title, color, due_date, completed_at 
                    WHERE user_id = %s
                """,
                (id,))

                
                rows = curr.fetchall()

                for row in rows:
                    results.append({
                        "id": row[0], 
                        "title": row[1], 
                        "color": row[2], 
                        "due_date": row[4], 
                        "completed_at": row[5]
                    })
        return results
    except pg.Error as e:
        return jsonify({"Error: ": str(e)})
        


