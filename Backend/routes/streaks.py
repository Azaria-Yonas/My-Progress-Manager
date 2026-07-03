# routes/streaks.py
from flask import jsonify
import psycopg as pg
from clients.psycopg_connect import psycopg_connect



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
        return jsonify(results)
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400


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

                return jsonify({
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
                })
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400