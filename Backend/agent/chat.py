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


class Chats:
    """
        This class is the collection of sequences of texts (Text object) 
        between the different users and the agent
    """
    sessions_table = {}
    def __init__(self, id):
        self.user_id = id
        self.session_id = str(uuid4())
        self._chat_history = []
        self.sessions_table[self.user_id] = self.session_id

    @property
    def chat_history(self):
        return self._chat_history

    @chat_history.setter
    def chat_history(self, text: Text):
        self._chat_history.append(text)













