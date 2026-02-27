import os
from flask import Flask, render_template
from supabase import create_client, Client
from flask import Flask, jsonify


URL = os.getenv("supabaseurl")
API_KEY= os.getenv("supabasekey")

if URL and API_KEY is not None:
    supabase: Client = create_client(URL, API_KEY)
else:
    raise Exception("Connection Unsuccessfull: API Key or URL Missing" )





app = Flask(__name__)

@app.route("/tasks")
def get_tasks():
    response = (
        supabase.table("tasks")
        .select("*")
        .eq("user_id", "3f027e9f-2437-4f5e-90ed-c6423ffb4186")
        .execute()
    )

    data = response.data or []
    count = response.count or 0

    print(response)

    return jsonify({"data": data, "count": count})



@app.route('/')
def getT1():
    return render_template('index.html')


@app.route('/getTable')
def getTable():
    return "http://127.0.0.1:5000/tasks"


if __name__ == "__main__":
    app.run(debug=True)