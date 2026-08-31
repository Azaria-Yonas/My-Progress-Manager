
from uuid import uuid4
from time import time

import threading

class Conversation:
    """This function tracks the converstion."""
    def __init__(self, id = uuid4()):
        self.conversation_id = id
        self.timer = self.set_timer()



    def set_timer (self, time = 180):
        return threading.Timer(time, self.expire)



    # to cancel the timer self.timer.cancel

    def expire(self):
        """This is the funciton that executes when the user 
        fails to keep the conversation going and the agent has 
        no choice but to drop the old conversation and start a 
        new one"""

        self.conversation_id = uuid4()
        self.timer = self.set_timer()




    def renew(self):
        """This function renews the timer and retains the 
        conversation id"""

        self.timer.cancel()
        self.timer = self.set_timer()
        self.timer.start()













