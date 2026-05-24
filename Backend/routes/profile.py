from flask import jsonify
import psycopg as pg
from clients.psycopg_connect import psycopg_connect
from clients.supabase_client import new_client


def getme(id):
    try:
        results = []
        with psycopg_connect() as conn:
            with conn.cursor() as curr:
                curr.execute("""
                    SELECT created_at, raw_user_meta_data FROM auth.users 
                    WHERE id = %s 
                """,
                (id,))
                results = curr.fetchall()
        created_at, meta_data = results[0]
        return jsonify({
            "id": id,
            "email": meta_data["email"],
            "firstName": meta_data["firstName"],
            "lastName": meta_data["lastName"],
            "created_at": created_at
        })
    except pg.Error as e:
        return jsonify({"Error: " : str(e)}), 400



def signout(id):
    try:
        new_client().auth.sign_out(id)
        return jsonify({"message: ": "Successful Signed Out"})       
    except Exception as e:
        return jsonify({"Error: ": str(e)}), 400
