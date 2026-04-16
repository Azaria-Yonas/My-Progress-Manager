CREATE TABLE mydb.streaks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),

    title text NOT NULL,

    date_started timestamptz NOT NULL DEFAULT now(),  -- This is the date that the streak was created
    date_ended timestamptz,  -- This is the date that the streak was completed and no longer active


    start_time timestamptz,    -- This is the start time of the current interval
    interval_seconds bigint NOT NULL CHECK (interval_seconds > 0),  -- This is the length of each interval in seconds set by the user

    streak_count bigint DEFAULT 0 CHECK (streak_count >= 0),
    last_tap_at timestamptz,

    data JSONB NOT NULL DEFAULT '{}'::jsonb,

    is_paused boolean NOT NULL DEFAULT false,
    paused_at timestamptz


);

CREATE INDEX index_streaks_userid ON mydb.streaks(user_id);


ALTER TABLE mydb.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY " A User can only view their own streaks"
ON mydb.streaks
FOR SELECT
USING (auth.uid() = user_id);


CREATE POLICY " A User can only insert their own streaks"
ON mydb.streaks
FOR INSERT
WITH CHECK (auth.uid() = user_id);


CREATE POLICY " A User can only update their own streaks"
ON mydb.streaks
FOR UPDATE
USING (auth.uid() = user_id);


CREATE POLICY " A User can only delete their own streaks"
ON mydb.streaks
FOR DELETE
USING (auth.uid() = user_id);