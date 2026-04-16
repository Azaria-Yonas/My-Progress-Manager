CREATE TABLE mydb.completed_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),

    title text NOT NULL,
    color text NOT NULL,
    due_date timestamptz NOT NULL,
    created_at timestamptz DEFAULT now(),
    completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX index_completed_tasks_userid ON mydb.completed_tasks(user_id);


ALTER TABLE mydb.completed_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY " A User can only view their own completed tasks"
ON mydb.completed_tasks
FOR SELECT
USING (auth.uid() = user_id);


CREATE POLICY " A User can only insert their own completed tasks"
ON mydb.completed_tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);


CREATE POLICY " A User can only update their own completed tasks"
ON mydb.completed_tasks
FOR UPDATE
USING (auth.uid() = user_id);


CREATE POLICY " A User can only delete their own completed tasks"
ON mydb.completed_tasks
FOR DELETE
USING (auth.uid() = user_id);