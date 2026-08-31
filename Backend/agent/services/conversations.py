
from uuid import uuid4
from time import time

import threading

class Conversation:
    """This function tracks the converstion."""

   

    def __init__(self):
        self.conversation_id = None
        self.timer = None
        self.default_conversation = uuid4()

    def check(self):
        return (self.timer is None) == (self.conversation_id is None) 

    def set_timer (self, time = 180):
        return threading.Timer(time, self.expire)



    def expire(self):
        """This is the funciton that executes when the user 
        fails to keep the conversation going and the agent has 
        no choice but to drop the old conversation and start a 
        new one"""
        self.conversation_id, self.timer = None, None




    def renew(self):
        """This function renews the timer and retains the 
        conversation id"""

        if not isinstance(self.timer, threading.Timer):
            return "Timer Not Initiated"

        if not self.timer.is_alive():
            return "Timer Not Active"

        self.timer.cancel()
        self.timer = self.set_timer()
        self.timer.start()




    def get_id(self, default = False):

        if default:
            self.default_conversation

        if self.conversation_id is None:
            return "No Conversation ID available (create a new one)"

        

        return


        





























# class Conversation:
#     """This function tracks the converstion."""

   

#     def __init__(self, id = uuid4()):
#         self.conversation_id = id
#         self.timer = self.set_timer() 
#         self.default_conversation = uuid4()



#     def set_timer (self, time = 180):
#         return threading.Timer(time, self.expire)



#     # to cancel the timer self.timer.cancel

#     def expire(self):
#         """This is the funciton that executes when the user 
#         fails to keep the conversation going and the agent has 
#         no choice but to drop the old conversation and start a 
#         new one"""

#         self.conversation_id = None
#         self.timer = None




#     def renew(self):
#         """This function renews the timer and retains the 
#         conversation id"""

#         self.timer.cancel()
#         self.timer = self.set_timer()
#         self.timer.start()



#     def get_id(self, default = False):
#         if default:
#             self.default_conversation


#         if self.conversation_id is None:
#             self.conversation_id = uuid4()

#         if not isinstance(self.timer, threading.Timer):
#             self.timer = self.set_timer()
#             self.timer.start
#         else:
#             if not self.timer.is_alive():
#                 self.timer.start()

#         return self.conversation_id








