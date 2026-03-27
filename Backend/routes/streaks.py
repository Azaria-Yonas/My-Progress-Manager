from clients.psycopg_connect import psycopg_connect




def fecth_streaks(user_id):
    results = []
    with psycopg_connect() as conn:
        with conn.cursor() as curr:
            curr.execute("""
                SELECT title, start_time, interval_seconds, streak_count FROM mydb.streaks
                WHERE user_id = %s
            """,
            (user_id,))

            rows = curr.fetchall()

            for row in rows:
                results.append({
                    "title": row[0],
                    "start_time": row[1],
                    "interval_seconds": row[2],
                    "streak_count": row[3],
                })

    return results
