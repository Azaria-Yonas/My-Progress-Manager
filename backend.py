import os
from flask import Flask, render_template
from supabase import create_client, Client
from flask import Flask, jsonify


URL = os.getenv("supabaseurl")
ANON_KEY= os.getenv("supabasekey")

if URL and ANON_KEY is not None:
    supabase: Client = create_client(URL, ANON_KEY)
else:
    raise Exception("Connection Unsuccessfull: API Key or URL Missing" )





app = Flask(__name__)

@app.route("/data")
def get_tasks():
    response = (
        supabase.table("Test") # doesn't work for the tasks table
        .select("*")
        .execute()
    )

    data = response.data or []
    count = response.count or 0

    return jsonify({"data": data, "count": count})



@app.route('/')
def getT1():
    return render_template('index.html')




if __name__ == "__main__":
    app.run(debug=True)