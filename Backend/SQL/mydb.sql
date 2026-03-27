CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TABLE mydb.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),

    title text NOT NULL,
    description text,
    is_completed boolean NOT NULL DEFAULT false,
    order_index integer DEFAULT 0,
    color text NOT NULL,
    due_date timestamptz NOT NULL,
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE mydb.completed_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),

    title text NOT NULL,
    color text NOT NULL,
    due_date timestamptz NOT NULL,
    completed_at timestamptz NOT NULL DEFAULT now()
);



CREATE TABLE mydb.streaks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),

    title text NOT NULL,

    Date_Started timestamptz NOT NULL DEFAULT now(),
    Date_Ended timestamptz,


    start_time timestamptz;
    end_time timestamptz;
    interval_seconds bigint NOT NULL CHECK (interval_seconds > 0),

    streak_count bigint DEFAULT 0 CHECK (streak_count >= 0),

    data JSONB NOT NULL DEFAULT '{}'::jsonb,







    duration_seconds bigint NOT NULL CHECK (duration_seconds > 0),

    cooldown_end timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,

    streak_count bigint DEFAULT 0 CHECK (streak_count >= 0),
    last_tap_at timestamptz,
    paused boolean NOT NULL DEFAULT false,
    highest_streak bigint DEFAULT 0
);



CREATE TABLE mydb.completed_streaks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),

    title text,
    streak_count bigint NOT NULL DEFAULT 0 CHECK (streak_count >= 0),
    duration_seconds bigint CHECK (duration_seconds > 0),

    created_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz NOT NULL DEFAULT now(),

    total_intervals bigint NOT NULL DEFAULT 0,
    successful_intervals bigint NOT NULL DEFAULT 0,
    failed_intervals bigint DEFAULT 0,

    calendar_data jsonb NOT NULL DEFAULT '{}'::jsonb,
    CHECK (jsonb_typeof(calendar_data) = 'object')
);
