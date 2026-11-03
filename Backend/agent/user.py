
from clients.psycopg_connect import psycopg_connect











class User:
    """This class stores the users id which was created at login time aswell as
      the user data (if any) associtated with that user id"""
    def __init__(self,uuid = None):
        self.user_id = uuid
        self.user_data = None

        if self.user_id is not None:
            self.user_data = self.load_user_data()


    def __repr__(self):
        return(str(self.user_id))


    def load_user_data(self, uuid = None):

        if uuid is None:
            uuid = self.user_id

        try:
            with psycopg_connect() as conn: 
                with conn.cursor() as curr:
                    curr.execute( 
                        "SELECT agent_name, user_data FROM public.agent WHERE user_id = %s", 
                        (uuid,)
                    ) 

                    row = curr.fetchone()
                    if row is None:
                        return {"User Data" : "No User Data"}

                    return {"User Data" :  { 
                        "Agent's User Given Name" :row[0],
                        "User Prefrences" : row[1]
                        }
                    }

                
        except:
            return {"User Data" : "No User Data"}















