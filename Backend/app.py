# app.py
from flask import Flask, request, jsonify
from auth.auth import authenticate_userid
from routes.login import login
from routes.signup import signup
from routes.profile import getme, signout
from routes.tasks import fecth_tasks, create_task, delete_task, complete_task, reorder_tasks
from routes.streaks import fecth_streaks, create_streak
from routes.stats import tasks_analytics, streaks_analytics

 
app = Flask(__name__)




@app.route("/login", methods=["POST"])                      # Login 
def login_route():
    return login()

@app.route("/sigup", methods=["POST"])                      # SignUp
def signup_route_route():
    return signup()


@app.route("/me", methods = ["GET"])                        # Get Me
def gme():
    try:
        id = authenticate_userid(request)
        return getme(id)
    except Exception as e:
        return str(e), 400

@app.route("/logout", methods = ["POST"])                   # Sign Out
def lout():
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or authenticate_userid(request) is None:
            return jsonify({"Error: ": "Unauthorized"}), 401
        token = auth_header.split(" ")[1]
        return signout(token)
    except Exception as e:
        return str(e), 400


@app.route("/tasks", methods = ["GET"])                     # Fetch Tasks
def ftasks():
    try:
        id = authenticate_userid(request)
        return fecth_tasks(id)
    except Exception as e:
        return str(e), 400
    
@app.route("/tasks", methods = ["POST"])                    # Create Tasks
def ctasks():
    try:
        data = request.json
        title = data["title"]
        color = data["color"]
        due_date = data["due_date"]
        id = authenticate_userid(request)
        return create_task(id, title, color, due_date)
    except Exception as e:
        return str(e), 400
    
    
@app.route("/tasks/<id>", methods = ["DELETE"])             # Delete Task
def dtask(id):
    try:
        user_id = authenticate_userid(request)
        return delete_task(user_id, id)
    except Exception as e:
        return str(e), 400

@app.route("/tasks/<id>/complete", methods = ["POST"])      # Complete Task 
def ctask(id):
    try:
        user_id = authenticate_userid(request)
        return complete_task(user_id, id)
    except Exception as e:
        return str(e), 400
    
@app.route("/tasks/reorder", methods = ["PATCH"])           # Reorder Tasks
def rtask():
    try:
        data = request.json
        tasks = data["tasks"]
        user_id = authenticate_userid(request)
        return reorder_tasks(user_id, tasks)
    except Exception as e:
        return str(e), 400


@app.route("/streaks", methods = ["GET"])                   # Fetch Streaks
def fstreaks():
    try:
        id = authenticate_userid(request)
        return fecth_streaks(id)
    except Exception as e:
        return str(e), 400
    
@app.route("/streaks", methods = ["POST"])                  # Create Streaks
def cstreaks():
    try:
        data = request.json
        title = data["title"]
        duration_seconds = data["duration_seconds"]
        id = authenticate_userid(request)
        return create_streak(id, title, duration_seconds)
    except Exception as e:
        return str(e), 400

@app.route("/stats/tasks", methods = ["GET"])
def gctasks():
    try:
        id = authenticate_userid(request)
        return tasks_analytics(id)
    except Exception as e:
        return str(e), 400
    

@app.route("/stats/streaks", methods = ["GET"])
def gcstreaks():
    try:
        id = authenticate_userid(request)
        return streaks_analytics(id)
    except Exception as e:
        return str(e), 400
    
    

@app.route("/")
def home():
    return "Backend is running"


if __name__ == "__main__":
    app.run(debug=True)
