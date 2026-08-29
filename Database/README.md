# Database — Supabase Postgres

[← Back to project README](../README.md)








<p align="center">
  <img src="../Auxiliary%20and%20Resources/Database.png" width="100%" alt="Database schema — tasks, streaks, completed_tasks, completed_streaks and agent, all keyed to auth.users.id">
</p>



## Row-Level Security


I have enabled row level security  for every table that I have created to ensure a user can only touch their own data.

The policies look like this:

```sql
CREATE POLICY user_isolation ON public.tasks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```


## Supabase Realtime

In order for the application to reflect changes, such as a new task created in another session or any other changes to the database, the database needs to send out notifications. For this project, I enabled `Postgres Changes` so that the application can be notified when there are database changes.

To enable this feature, I did it from my project's dashboard in Supabase. However, you can also manually enable it by executing the SQL commands in [supabase_realtime](supabase_realtime.sql).


[← Back to project README](../README.md)