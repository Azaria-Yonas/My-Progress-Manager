# Backend — Flask API

[← Back to project README](../README.md)



## Table of Contents


- [File Tree and Description](#file-tree-and-description)
- [Stack](#stack)
- [Setup](#setup)
- [Running](#running)
- [API Reference](#api-reference)
  - [HTTP](#http)
  - [Auth](#auth)
  - [Tasks](#tasks)
  - [Streaks](#streaks)
  - [Stats & Agent](#stats--agent)
  - [Misc](#misc)
  - [WebSockets](#websockets)
- [The Agent](#the-agent)
- [Deployment Notes](#deployment-notes)


## File Tree and Description

<pre>
Backend
├── <a href="app.py">1. app.py</a>
├── <a href="config.py">2. config.py</a>
├── <a href="error.py">3. error.py</a>
├── <a href="requirements.txt">4. requirements.txt</a>
├── <a href="agent/">5. agent/</a>
├── <a href="auth/">6. auth/</a>
│   └── <a href="auth/auth.py">auth.py</a>
├── <a href="clients/">clients/</a>
│   ├── <a href="clients/psycopg_connect.py">7. psycopg_connect.py</a>
│   └── <a href="clients/supabase_client.py">8. supabase_client.py</a>
├── <a href="env/">9. env/</a>
│   ├── <a href="env/.env.example">.env.example</a>
│   └── <a href="env/env.md">env.md</a>
├── <a href="routes/">10. routes/</a>
│   ├── <a href="routes/agent.py">agent.py</a>
│   ├── <a href="routes/login.py">login.py</a>
│   ├── <a href="routes/profile.py">profile.py</a>
│   ├── <a href="routes/signup.py">signup.py</a>
│   ├── <a href="routes/stats.py">stats.py</a>
│   ├── <a href="routes/streaks.py">streaks.py</a>
│   └── <a href="routes/tasks.py">tasks.py</a>
└── <a href="services/">services/</a>
    └── <a href="services/streak_timer.py">11. streak_timer.py</a>
</pre>


1. `app.py` : This file file is where the flask app along with all the endpoints live. It initially started as a pure request-response flask app, however I incorporated **Flask Sock** in order to create web sockets that enbale the application to get realtime updataes with out having to refresh. Adding Flask Sock also makes it so that the app can sync between sessions in real time.

2. `config.py` : This file primarily exists so I dont have to rewrite evironment variable retrieving logic everywhere and just helps keep everything centralized.

3. `error.py` : Initially my app was sending the raw execeptions as error srings to the user but that's againt UI/UX design principles so then I created this file so that I can log the error string and codes so that I can debug while the user gets a message that is appropriate and understandable

4. `requirements.py` : The collections of packages, modules and tools needed to run this project

5. `agent/` : This is where all the logic related to the agent lives. It has its own README.md file which discusses the details in depth.

6. `auth/auth.py` : Every user request is accompanied with an access token. This file takes the access token and uses Supabases SDK to verify it by checking the `auth.sessions` table for active user sessions, which I configured to last about an hour. Ultimately, if a session is active it extracts the `user_id` and passes it on.

7. `clients/psycopg_connect.py` : In this file is a pycopg connection object. I created it just because I didn't what to rewrite the same logic every where I needed to query my Supabase tables.

8. `client/supabase_client.py` : In this file is a Supabase Client. 

9. `env/` : This folder contains all the variables I used in this project. There is also very useful information for those who are trying to reproduce this project in [env/env.md](env/env.md)

10. `routes/` : A lot of the abstractions in [app.py](app.py) exist in this folder This folder contains all the SQL quering and data handling for the endpoints.



## Stack

| Package | Role |
|---|---|
| `Flask` |  |
| `flask-sock` |  |
| `gunicorn` |  |
| `supabase` |  |
| `psycopg` |  |
| `openai` |  |
| `tavily-python` |  |
| `python-dotenv` |  |

## Setup

```bash
cd Backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```










---
- Consult and Read: 

  - [env/.env.example](env/.env.example)
  - [env/env.md](env/env.md)

---








Create a `env/.env` in this directory:

```
SUPABASE_URL=
SUPABASE_KEY=
DATABASE_URL=
OPENAI_API_KEY=
TAVILY_API_KEY=
```

























## Running

```bash
python app.py
gunicorn app:app
```


























## API Reference


### HTTP




### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signup` | Create New Account |
| `POST` | `/login` | Login To Account |
| `GET` | `/me` | Retreive User Data |
| `POST` | `/logout` | Logout of account |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | Fetch User's Tasks |
| `POST` | `/tasks` | Create New Task |
| `PATCH` | `/tasks/<id>` | Update Task |
| `DELETE` | `/tasks/<id>` | Delete Task |
| `POST` | `/tasks/<id>/complete` | Complete Task |
| `POST` | `/tasks/<id>/undo-complete` | Undo Complete Task |
| `PATCH` | `/tasks/reorder` | Reorder Tasks |

### Streaks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/streaks` | Fetch User Streaks |
| `POST` | `/streaks` | Create New Streaks |
| `PATCH` | `/streaks/<id>` | Update Streak |
| `DELETE` | `/streaks/<id>` | Delete Streak |
| `POST` | `/streaks/<id>/tap` | Increment Streak |
| `POST` | `/streaks/<id>/pause` | Pause Streak |
| `POST` | `/streaks/<id>/expire` | Expire Streak |
| `POST` | `/streaks/<id>/complete` | Finish Streak |

### Stats 

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stats/tasks` | Fetch Tasks Record |
| `GET` | `/stats/streaks` | Fetch Streak Record |

### Agent 

| `GET` | `/agent` | Fetch User's Agent Preferences |
| `POST` | `/agent` | Create Agent Preferences |
| `PUT` | `/agent` | Update Agent Preferences |



### WebSockets


| Protocol | Endpoint | Description |
|---|---|---|
| `WS` | `/agent/message` | Agentic Chat |

### Other

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Check Status of Backend |

---




**[↑ Back to top](#backend--flask-api)**






