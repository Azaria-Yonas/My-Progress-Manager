-- Manually add the tables to Real Time inorder to receive postgres changes

ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.streaks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.completed_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.completed_streaks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent;



-- Grant access to read the table for logged in users

GRANT SELECT ON public.tasks TO authenticated;
GRANT SELECT ON public.streaks TO authenticated;
GRANT SELECT ON public.completed_tasks TO authenticated;
GRANT SELECT ON public.completed_streaks TO authenticated;
GRANT SELECT ON public.agent TO authenticated;