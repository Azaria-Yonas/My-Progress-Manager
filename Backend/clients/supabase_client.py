from supabase import create_client, AsyncClient
from config import SUPABASE_KEY, SUPABASE_URL, SUPABASE_ADMIN_KEY



def new_client():
    if not SUPABASE_KEY:
        raise Exception("Key is missing!!!")
    if not SUPABASE_URL:
        raise Exception("URL is missing!!!")

    return create_client(SUPABASE_URL, SUPABASE_KEY)

def admin_client():
    if not SUPABASE_ADMIN_KEY:
        raise Exception("Key is missing!!!")
    if not SUPABASE_URL:
        raise Exception("URL is missing!!!")

    return create_client(SUPABASE_URL, SUPABASE_ADMIN_KEY)  



async def new_async_client():
    if not SUPABASE_KEY:
        raise Exception("Key is missing!!!")
    if not SUPABASE_URL:
        raise Exception("URL is missing!!!")

    return AsyncClient(supabase_key=SUPABASE_KEY, supabase_url=SUPABASE_URL )



async def user_channel(user_id: str, callback):
    client = await new_async_client()

    changes = client.channel(f"user-{user_id}")

    changes.on_postgres_changes(
        "*", # type: ignore
        callback, 
        schema="public",
        table="tasks",
        filter=f"user_id=eq.{user_id}",
    )


    changes.on_postgres_changes(
        "*", # type: ignore
        callback,
        schema="public",
        table="completed_tasks",
        filter=f"user_id=eq.{user_id}",
    )
    changes.on_postgres_changes(
        "*", # type: ignore
        callback,
        schema="public",
        table="streaks",
        filter=f"user_id=eq.{user_id}",
    )

    changes.on_postgres_changes(
        "*", # type: ignore
        callback,
        schema="public",
        table="completed_streaks",
        filter=f"user_id=eq.{user_id}",
    )
    changes.on_postgres_changes(
        "*", # type: ignore
        callback,
        schema="public",
        table="agent",
        filter=f"user_id=eq.{user_id}",
    )

    await changes.subscribe()


    return changes











