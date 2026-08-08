# Backend — Flask API

[← Back to project README](../README.md)


























## Table of Contents

- [Stack](#stack)
- [Setup](#setup)
- [Running](#running)
- [API Reference](#api-reference)
  - [Auth](#auth)
  - [Tasks](#tasks)
  - [Streaks](#streaks)
  - [Stats & Agent](#stats--agent)
- [The Agent](#the-agent)
- [Deployment Notes](#deployment-notes)

## Stack

| Package | Role |
|---|---|
| `Flask` |  |
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


























Create a `.env` in this directory:

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


























### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signup` |  |
| `POST` | `/login` |  |
| `GET` | `/me` |  |
| `POST` | `/logout` |  |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` |  |
| `POST` | `/tasks` |  |
| `PATCH` | `/tasks/<id>` |  |
| `DELETE` | `/tasks/<id>` |  |
| `POST` | `/tasks/<id>/complete` |  |
| `POST` | `/tasks/<id>/undo-complete` |  |
| `PATCH` | `/tasks/reorder` |  |

### Streaks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/streaks` |  |
| `POST` | `/streaks` |  |
| `PATCH` | `/streaks/<id>` |  |
| `DELETE` | `/streaks/<id>` |  |
| `POST` | `/streaks/<id>/tap` |  |
| `POST` | `/streaks/<id>/pause` |  |
| `POST` | `/streaks/<id>/expire` |  |
| `POST` | `/streaks/<id>/complete` |  |

### Stats & Agent

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stats/tasks` |  |
| `GET` | `/stats/streaks` |  |
| `GET` | `/agent` |  |
| `POST` | `/agent` |  |
| `PUT` | `/agent` |  |
| `POST` | `/agent/message` |  |

> [!IMPORTANT]
> 

## The Agent


























<pre>
agent
├── <a href="agent/agent.py">agent.py</a>       
├── <a href="agent/agentic_loop.py">agentic_loop.py</a>  
├── <a href="agent/agent_bootstrap/">agent_bootstrap</a>  
│   ├── <a href="agent/agent_bootstrap/AGENT.md">AGENT.md</a>     
│   ├── <a href="agent/agent_bootstrap/APP.md">APP.md</a>       
│   ├── <a href="agent/agent_bootstrap/PERSONALITY.md">PERSONALITY.md</a>
│   ├── <a href="agent/agent_bootstrap/TOOLS.md">TOOLS.md</a>     
│   ├── <a href="agent/agent_bootstrap/USER.md">USER.md</a>      
│   └── <a href="agent/agent_bootstrap/IMPORTANT.md">IMPORTANT.md</a> 
├── <a href="agent/models/">models</a>           
│   ├── <a href="agent/models/openai_connector.py">openai_connector.py</a>
│   └── <a href="agent/models/anthropic_connector.py">anthropic_connector.py</a>
└── <a href="agent/tools/">tools</a>            
    ├── <a href="agent/tools/tools.json">tools.json</a>   
    ├── <a href="agent/tools/tools.py">tools.py</a>     
    ├── <a href="agent/tools/api.py">api.py</a>       
    └── <a href="agent/tools/web_search.py">web_search.py</a>
</pre>


























## Deployment Notes


























- ****  — 
- ****  — 

---

**[↑ Back to top](#backend--flask-api)**
