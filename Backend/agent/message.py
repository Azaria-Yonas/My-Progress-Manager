import time
from uuid import uuid4


class Text:
    """
        This is a specialized object for texts that encapsulate the user, message, and date
    """   
    def __init__(self, user, text: str):
        self.user = user
        self.text = text
        self.date = time.time_ns




class Message:
    session_table = {}
    def __init__(self):
        pass

    def new_message(self, user, text: Text):
        if user in self.session_table.keys():
            pass
        