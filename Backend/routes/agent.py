from flask import jsonify, request
import psycopg as pg
from clients.psycopg_connect import psycopg_connect


def get_data(user_id):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT data FROM public.agent WHERE user_id = %s
                """,
                (user_id,))

                row = curr.fetchone()
                if row is None:
                    return jsonify({"Error": "No data found"}), 400

                return jsonify(row[0])
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400
    

def append_data(user_id):
    try:
        data = request.json
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT EXISTS (SELECT 1 FROM public.agent WHERE user_id = %s)
                """,
                (user_id,))

                row = curr.fetchone()
                if (row is not None and row[0]):
                    curr.execute("""
                        UPDATE public.agent SET data = %s WHERE user_id = %s
                    """,
                    (data, user_id))
                else:
                    curr.execute("""
                        INSERT INTO public.agent (user_id, data) VALUES (%s, %s)
                    """,
                    (user_id, data))

                return jsonify({"message": "Data saved successfully"})
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400