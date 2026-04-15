CREATE TABLE mydb.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),

    title text NOT NULL,
    description text,
    is_completed boolean NOT NULL DEFAULT false,
    order_index integer DEFAULT 0,
    color text NOT NULL,
    due_date timestamptz NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);


CREATE INDEX index_tasks_userid ON mydb.tasks(user_id);
CREATE INDEX idx_tasks_user_order ON mydb.tasks(user_id, order_index);

ALTER TABLE mydb.tasks ENABLE ROW LEVEL SECURITY;


CREATE POLICY " A User can only view their own tasks"
ON mydb.tasks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY " A User can only insert their own tasks"
ON mydb.tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY " A User can only update their own tasks"
ON mydb.tasks
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY " A User can only delete their own tasks"
ON mydb.tasks
FOR DELETE
USING (auth.uid() = user_id);