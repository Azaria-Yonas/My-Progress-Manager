# app.py
from flask import Flask, request, jsonify
from auth.auth import authenticate_userid, AuthError
from routes.login import login
from routes.signup import signup
from routes.profile import getme, signout
from routes.tasks import fecth_tasks, create_task, update_task, delete_task, complete_task, undo_complete_task, reorder_tasks
from routes.streaks import fecth_streaks, create_streak, update_streak, delete_streak, tap_streak, expire_streak, pause_streak, complete_streak
from routes.stats import tasks_analytics, streaks_analytics
from routes.agent import configure_agent, get_agent, update_agent
from agent.loop import chat_loop
 
app = Flask(__name__)


def error_response(e):
    if isinstance(e, AuthError):
        return jsonify({"Error": str(e)}), 401
    return jsonify({"Error": str(e)}), 400


@app.route("/login", methods=["POST"])                          # Login 
def login_route():
    return login()

@app.route("/signup", methods=["POST"])                         # SignUp
def signup_route_route():
    return signup()


@app.route("/me", methods = ["GET"])                            # Get Me
def gme():
    try:
        id = authenticate_userid(request)
        return getme(id)
    except Exception as e:
        return error_response(e)

@app.route("/logout", methods = ["POST"])                       # Sign Out
def lout():
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or authenticate_userid(request) is None:
            return jsonify({"Error: ": "Unauthorized"}), 401
        token = auth_header.split(" ")[1]
        return signout(token)
    except Exception as e:
        return error_response(e)


@app.route("/tasks", methods = ["GET"])                         # Fetch Tasks
def ftasks():
    try:
        id = authenticate_userid(request)
        return fecth_tasks(id)
    except Exception as e:
        return error_response(e)
    
@app.route("/tasks", methods = ["POST"])                        # Create Tasks
def ctasks():
    try:
        data = request.json
        title = data["title"]
        color = data["color"]
        due_date = data["due_date"]
        id = authenticate_userid(request)
        return create_task(id, title, color, due_date)
    except Exception as e:
        return error_response(e)
    
    
@app.route("/tasks/<id>", methods = ["PATCH"])                  # Update Tasks
def utask(id):
    try:
        data = request.json
        user_id = authenticate_userid(request)
        return update_task(user_id, id, data)
    except Exception as e:
        return error_response(e)


@app.route("/tasks/<id>", methods = ["DELETE"])                 # Delete Task
def dtask(id):
    try:
        user_id = authenticate_userid(request)
        return delete_task(user_id, id)
    except Exception as e:
        return error_response(e)

@app.route("/tasks/<id>/complete", methods = ["POST"])          # Complete Task 
def ctask(id):
    try:
        user_id = authenticate_userid(request)
        return complete_task(user_id, id)
    except Exception as e:
        return error_response(e)
@app.route("/tasks/<id>/undo-complete", methods = ["POST"])     # Undo-Complete Task 
def uctask(id):
    try:
        user_id = authenticate_userid(request)
        return undo_complete_task(user_id, id)
    except Exception as e:
        return error_response(e)

    
@app.route("/tasks/reorder", methods = ["PATCH"])               # Reorder Tasks
def rtask():
    try:
        data = request.json
        tasks = data["tasks"]
        user_id = authenticate_userid(request)
        return reorder_tasks(user_id, tasks)
    except Exception as e:
        return error_response(e)
    

@app.route("/streaks", methods = ["GET"])                       # Fetch Streaks
def fstreaks():
    try:
        id = authenticate_userid(request)
        return fecth_streaks(id)
    except Exception as e:
        return error_response(e)
    
@app.route("/streaks", methods = ["POST"])                      # Create Streaks
def cstreaks():
    try:
        data = request.json
        title = data["title"]
        duration_seconds = data["duration_seconds"]
        id = authenticate_userid(request)
        return create_streak(id, title, duration_seconds)
    except Exception as e:
        return error_response(e)

@app.route("/streaks/<id>", methods = ["PATCH"])                # Update Streaks
def ustreak(id):
    try:
        data = request.json
        user_id = authenticate_userid(request)
        return update_streak(user_id, id, data)
    except Exception as e:
        return error_response(e)

@app.route("/streaks/<id>", methods = ["DELETE"])               # Delete Streaks
def dstreak(id):
    try:
        user_id = authenticate_userid(request)
        return delete_streak(user_id, id)
    except Exception as e:
        return error_response(e)

@app.route("/streaks/<id>/tap", methods = ["POST"])             # Increment Streaks
def tstreak(id):
    try:
        user_id = authenticate_userid(request)
        return tap_streak(user_id, id)
    except Exception as e:
        return error_response(e)

@app.route("/streaks/<id>/expire", methods = ["POST"])          # Expired Streaks
def estreak(id):
    try:
        user_id = authenticate_userid(request)
        return expire_streak(user_id, id)
    except Exception as e:
        return error_response(e)

@app.route("/streaks/<id>/pause", methods = ["POST"])           # Pause Streak
def pstreak(id):
    try:
        data = request.json
        paused = data["paused"]
        user_id = authenticate_userid(request)
        return pause_streak(user_id, id, paused)
    except Exception as e:
        return error_response(e)

@app.route("/streaks/<id>/complete", methods = ["POST"])
def cstreak(id):
    try:
        data = request.json
        total_intervals = data["total_intervals"]
        successful_intervals = data["successful_intervals"]
        failed_intervals = data["failed_intervals"]
        calendar_data = data["calendar_data"]
        user_id = authenticate_userid(request)
        return complete_streak(user_id, id, total_intervals, successful_intervals, failed_intervals, calendar_data)
    except Exception as e:
        return error_response(e)

@app.route("/stats/tasks", methods = ["GET"])                   # Tasks Analytics
def gctasks():
    try:
        id = authenticate_userid(request)
        return tasks_analytics(id)
    except Exception as e:
        return error_response(e)
    

@app.route("/stats/streaks", methods = ["GET"])                 # Streaks Analytics
def gcstreaks():
    try:
        id = authenticate_userid(request)
        return streaks_analytics(id)
    except Exception as e:
        return error_response(e)
    
    
@app.route("/agent", methods = ["GET"])                          # Get Agent
def gagent():
    try:
        id = authenticate_userid(request)
        if id is None:
            return jsonify({"Error": "Unauthorized"}), 401
        return get_agent(id)
    except Exception as e:
        return error_response(e)

@app.route("/agent", methods = ["POST"])                         # Configure Agent
def cagent():
    try:
        data = request.json
        name = data["agent_name"]
        picture = data["avatar_picture"]
        text = data["user_data"]
        id = authenticate_userid(request)
        if id is None:
            return jsonify({"Error": "Unauthorized"}), 401
        return configure_agent(id, name, picture, text)
    except Exception as e:
        return error_response(e)


@app.route("/agent", methods = ["PUT"])                         # Update Agent
def uagent():
    try:
        data = request.json
        name = data["agent_name"]
        picture = data["avatar_picture"]
        text = data["user_data"]
        id = authenticate_userid(request)
        if id is None:
            return jsonify({"Error": "Unauthorized"}), 401
        return update_agent(id, name, picture, text)
    except Exception as e:
        return error_response(e)


@app.route("/agent/message", methods = ["POST"])                 # Message Agent
def magent():
    try:
        id = authenticate_userid(request)
        data = request.json()
        chat = data["chat"]
        if id is None:
            return jsonify({"Error": "Unauthorized"}), 401
        return chat_loop(chat)
    except Exception as e:
        return error_response(e)


@app.route("/")
def home():
    return "Backend is running"


if __name__ == "__main__":
    app.run(debug=True)
