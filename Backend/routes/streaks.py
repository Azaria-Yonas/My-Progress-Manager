from flask import Flask
import psycopg as pg
import supabase




def fetch_tasks(token):

    id = 0
    
    with pg.connect(
        host="db.guqkkaslkjwvbtpwmgjn.supabase.co",
        dbname="postgres",
        user="postgres",
        password="SupaSafePassword1738",
        port=5432,
    ) as conn:
        with conn.cursor() as curr:

            curr.execute("""
                Select title, streak_count, due_date FROM tasks
                WHERE id = %s
            """)









# CREATE TABLE public.completed_streaks (
#   id uuid NOT NULL DEFAULT gen_random_uuid(),
#   user_id uuid NOT NULL DEFAULT gen_random_uuid(),
#   title text,
#   streak_count bigint NOT NULL DEFAULT '0'::bigint,
#   duration_seconds bigint,
#   created_at timestamp with time zone NOT NULL DEFAULT now(),
#   completed_at timestamp with time zone NOT NULL DEFAULT now(),
#   total_intervals bigint NOT NULL DEFAULT '0'::bigint,
#   successful_intervals bigint NOT NULL DEFAULT '0'::bigint,
#   failed_intervals bigint DEFAULT '0'::bigint,
#   calendar_data jsonb NOT NULL DEFAULT '{}'::jsonb,
#   CONSTRAINT completed_streaks_pkey PRIMARY KEY (id),
#   CONSTRAINT completed_streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
