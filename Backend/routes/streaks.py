# routes/streaks.py
from flask import jsonify
import psycopg as pg
from psycopg import sql
from psycopg.types.json import Jsonb
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


def update_streak(user_id, id, values):
    fields = ["title", "duration_seconds", "cooldown_end", "streak_count", "last_tap_at", "paused"]
    updates = {field: values[field] for field in fields if field in values}
    if not updates:
        return jsonify({"Error": "No fields to update"}), 400
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
                    return jsonify({"Error": "Streak not found"}), 404

                return jsonify({
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
    except pg.Error as e:
        return jsonify({"Error": str(e)}), 400


def delete_streak(user_id, id):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    DELETE FROM public.streaks
                    WHERE user_id = %s AND id = %s
                """,
                (user_id,id))
        return jsonify({"message": "Successfully Deleted Streak"})
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400


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
                    return jsonify({"Error": "Streak not found"}), 404

                return jsonify({
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
    except pg.Error as e:
        return jsonify({"Error": str(e)}), 400


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
                    return jsonify({"Error": "Streak not found"}), 404

                return jsonify({
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
    except pg.Error as e:
        return jsonify({"Error": str(e)}), 400


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
                    return jsonify({"Error": "Streak not found"}), 404

                return jsonify({
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
    except pg.Error as e:
        return jsonify({"Error": str(e)}), 400


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
                    return jsonify({"Error": "Streak not found"}), 404

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
        return jsonify({"message": "Successfully Completed Streak"})
    except pg.Error as e:
        return jsonify({"Error": str(e)}), 400