
CREATE TABLE mydb.completed_streaks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),

    title text NOT NULL,

    date_started timestamptz NOT NULL,
    date_ended timestamptz NOT NULL,

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


CREATE INDEX index_completed_streaks_userid ON mydb.completed_streaks(user_id);


ALTER TABLE mydb.completed_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY " A User can only view their own completed streaks"
ON mydb.completed_streaks
FOR SELECT
USING (auth.uid() = user_id);


CREATE POLICY " A User can only insert their own completed streaks"
ON mydb.completed_streaks
FOR INSERT
WITH CHECK (auth.uid() = user_id);


CREATE POLICY " A User can only update their own completed streaks"
ON mydb.completed_streaks
FOR UPDATE
USING (auth.uid() = user_id);


CREATE POLICY " A User can only delete their own completed streaks"
ON mydb.completed_streaks
FOR DELETE
USING (auth.uid() = user_id);