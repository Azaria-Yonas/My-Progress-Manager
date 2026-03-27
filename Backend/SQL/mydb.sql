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

    Date_Started timestamptz NOT NULL DEFAULT now(),  -- This is the date that the streak was created
    Date_Ended timestamptz,  -- This is the date that the streak was completed and no longer active


    start_time timestamptz,    -- This is the start time of the current interval
    interval_seconds bigint NOT NULL CHECK (interval_seconds > 0),  -- This is the length of each interval in seconds set by the user

    streak_count bigint DEFAULT 0 CHECK (streak_count >= 0),
    last_tap_at timestamptz,

    data JSONB NOT NULL DEFAULT '{}'::jsonb,

    is_paused boolean NOT NULL DEFAULT false,
    paused_at timestamptz,


);


CREATE TABLE mydb.completed_streaks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),

    title text NOT NULL,

    Date_Started timestamptz NOT NULL,
    Date_Ended timestamptz NOT NULL,

    interval_seconds bigint NOT NULL CHECK (interval_seconds > 0),

    streak_count bigint NOT NULL CHECK (streak_count >= 0),

    total_intervals bigint NOT NULL DEFAULT 0,
    successful_intervals bigint NOT NULL DEFAULT 0,
    failed_intervals bigint DEFAULT 0,

    last_tap_at timestamptz,

    data jsonb NOT NULL DEFAULT '{}'::jsonb,
    calendar_data jsonb NOT NULL DEFAULT '{}'::jsonb,

    CHECK (jsonb_typeof(calendar_data) = 'object')
);
