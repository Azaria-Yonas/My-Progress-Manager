from flask import jsonify, request
import psycopg as pg
from clients.psycopg_connect import psycopg_connect


def get_agent(user_id):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT agent_name, avatar_picture, user_data FROM public.agent WHERE user_id = %s
                """,
                (user_id,))

                row = curr.fetchone()
                if row is None:
                    return jsonify({"Error": "No data found"}), 400

                return jsonify(row)
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400
    

def configure_agent(user_id, agent_name, avatar_picture, user_data):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT user_id FROM public.agent WHERE user_id = %s
                """,
                (user_id,))

                if curr.fetchone() is None:
                    curr.execute("""
                        INSERT INTO public.agent (user_id, agent_name, avatar_picture, user_data) VALUES (%s, %s, %s, %s)
                    """,
                    (user_id, agent_name, avatar_picture, user_data))
                else:
                    curr.execute("""
                        UPDATE public.agent
                        SET agent_name = %s, avatar_picture = %s, user_data = %s
                        WHERE user_id = %s
                    """,
                    (agent_name, avatar_picture, user_data, user_id))

                return jsonify({"message": "Agent configured successfully"})
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400

def update_agent(user_id, agent_name, avatar_picture, user_data):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    UPDATE public.agent
                    SET agent_name = %s, avatar_picture = %s, user_data = %s
                    WHERE user_id = %s
                    RETURNING agent_name, avatar_picture, user_data
                """,
                (agent_name, avatar_picture, user_data, user_id))

                row = curr.fetchone()
                if row is None:
                    return jsonify({"Error": "Agent not found"}), 404

                return jsonify(row)
    except pg.Error as e:
        return jsonify({"Error": str(e)}), 400
