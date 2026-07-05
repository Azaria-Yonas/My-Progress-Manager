
CREATE TABLE IF NOT EXISTS public.Test (
  index integer NOT NULL DEFAULT 0,
  name text,
  CONSTRAINT Test_pkey PRIMARY KEY (index)
);


-- Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT ''::text,
  is_completed boolean NOT NULL DEFAULT false,
  order_index integer DEFAULT 0,
  color text NOT NULL DEFAULT ''::text,
  due_date timestamp without time zone NOT NULL,
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE INDEX user_tasks ON public.tasks (user_id);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_isolation ON public.tasks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- Streaks
CREATE TABLE IF NOT EXISTS public.streaks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  duration_seconds bigint NOT NULL,
  cooldown_end timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  streak_count bigint DEFAULT '0'::bigint,
  last_tap_at timestamp with time zone,
  paused boolean NOT NULL DEFAULT false,
  highest_streak bigint DEFAULT '0'::bigint,
  CONSTRAINT streaks_pkey PRIMARY KEY (id),
  CONSTRAINT streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE INDEX user_streaks ON public.streaks (user_id);
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_isolation ON public.streaks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- Completed Tasks
CREATE TABLE IF NOT EXISTS public.completed_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT ''::text,
  color text NOT NULL,
  due_date timestamp with time zone NOT NULL,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT completed_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT completed_table_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE INDEX user_ctasks ON public.completed_tasks (user_id);
ALTER TABLE public.completed_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_isolation ON public.completed_tasks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
  

-- Completed Streaks
CREATE TABLE IF NOT EXISTS public.completed_streaks ( 
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  streak_count bigint NOT NULL DEFAULT '0'::bigint,
  duration_seconds bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  total_intervals bigint NOT NULL DEFAULT '0'::bigint,
  successful_intervals bigint NOT NULL DEFAULT '0'::bigint,
  failed_intervals bigint DEFAULT '0'::bigint,
  calendar_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT completed_streaks_pkey PRIMARY KEY (id),
  CONSTRAINT completed_streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE INDEX user_cstreaks ON public.completed_streaks (user_id);
ALTER TABLE public.completed_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_isolation ON public.completed_streaks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


