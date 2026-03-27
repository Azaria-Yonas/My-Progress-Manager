from clients.psycopg_connect import psycopg_connect




def fecth_tasks(user_id):
    results = []
    with psycopg_connect() as conn:
        with conn.cursor() as curr:
            curr.execute("""
                SELECT title, description, due_date, color FROM mydb.tasks
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
                })

    return results