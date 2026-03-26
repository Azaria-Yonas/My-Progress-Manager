from psycopg_connect import psycopg_connect


pg = psycopg_connect()




def load_streaks(JWT):
    id = JWT.id
    response = []
    with pg.cursor() as curr:
        curr.execute("""
            SELECT * FROM public.streaks;
        """)
        response = curr

    
 