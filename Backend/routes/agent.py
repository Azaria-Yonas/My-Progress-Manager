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

                return jsonify(row[0])
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400
    

def configure_agent(user_id, agent_name, avatar_picture, user_data):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    INSERT INTO public.agent (user_id, agent_name, avatar_picture, user_data) VALUES (%s, %s, %s, %s)
                    """,
                    (user_id, agent_name, avatar_picture, user_data))

                return jsonify({"message": "Agent configured successfully"})
    except pg.Error as e:
        return jsonify({"Error: ": str(e)}), 400

def update_agent(user_id, agent_name=None, avatar=None, user_data=None):
    try:
        with psycopg_connect() as conn:
            with conn.cursor() as curr:

                updates = []
                values = []

                if agent_name is not None:
                    updates.append("agent_name = %s")
                    values.append(agent_name)

                if avatar is not None:
                    updates.append("avatar = %s")
                    values.append(avatar)

                if user_data is not None:
                    updates.append("user_data = %s")
                    values.append(user_data)

                if updates:
                    values.append(user_id)

                    query = f"""
                        UPDATE public.agent
                        SET {', '.join(updates)}
                        WHERE user_id = %s
                    """

                    curr.execute(query, values)

                return jsonify({"message": "Data saved successfully"})

    except pg.Error as e:
        return jsonify({"Error": str(e)}), 400
