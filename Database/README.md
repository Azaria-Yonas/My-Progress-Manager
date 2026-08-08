# Database — Supabase Postgres

[← Back to project README](../README.md)


























<p align="center">
  <img src="../Auxiliary%20and%20Resources/Database.png" width="100%" alt="Database schema — tasks, streaks, completed_tasks, completed_streaks and agent, all keyed to auth.users.id">
</p>

## Table of Contents

- [Setup](#setup)
- [Row-Level Security](#row-level-security)
- [Schema](#schema)
  - [`tasks`](#tasks)
  - [`streaks`](#streaks)
  - [`completed_tasks`](#completed_tasks)
  - [`completed_streaks`](#completed_streaks)
  - [`agent`](#agent)
- [Files](#files)

## Setup


























## Row-Level Security


























> [!IMPORTANT]
> 

## Schema

### `tasks`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid |  |
| `user_id` | uuid |  |
| `title` | text |  |
| `is_completed` | boolean |  |
| `order_index` | integer |  |
| `color` | text |  |
| `due_date` | timestamp |  |
| `updated_at` | timestamp |  |

### `streaks`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid |  |
| `user_id` | uuid |  |
| `title` | text |  |
| `duration_seconds` | bigint |  |
| `streak_count` | bigint |  |
| `highest_streak` | bigint |  |
| `last_tap_at` | timestamptz |  |
| `cooldown_end` | timestamptz |  |
| `paused` | boolean |  |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

### `completed_tasks`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid |  |
| `user_id` | uuid |  |
| `title` | text |  |
| `color` | text |  |
| `due_date` | timestamptz |  |
| `completed_at` | timestamptz |  |

### `completed_streaks`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid |  |
| `user_id` | uuid |  |
| `title` | text |  |
| `streak_count` | bigint |  |
| `duration_seconds` | bigint |  |
| `total_intervals` | bigint |  |
| `successful_intervals` | bigint |  |
| `failed_intervals` | bigint |  |
| `calendar_data` | jsonb |  |
| `created_at` | timestamptz |  |
| `completed_at` | timestamptz |  |

### `agent`

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid |  |
| `agent_name` | text |  |
| `avatar_picture` | text |  |
| `user_data` | jsonb |  |

## Files

<pre>
Database
├── <a href="public.sql">public.sql</a>               
└── <a href="mydb/">mydb</a>                     
    ├── <a href="mydb/tasks.sql">tasks.sql</a>            
    ├── <a href="mydb/streaks.sql">streaks.sql</a>          
    ├── <a href="mydb/completed_tasks.sql">completed_tasks.sql</a>  
    └── <a href="mydb/completed_streaks.sql">completed_streaks.sql</a>
</pre>


























---

**[↑ Back to top](#database--supabase-postgres)**
