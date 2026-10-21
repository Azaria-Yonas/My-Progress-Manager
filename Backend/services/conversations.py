
from uuid import uuid4
from time import time

import threading

class Conversation:
    """This function tracks the converstion. If a conversation has been idle for longer 
    than 5 minutes (the default) then the the conversation manager creates a new conversation.
    Therefore, the agent and the user need to be in continous communication for the conversation
    to persist. Moreover, Every time that the user or the agent sends a message the timer for the
    coversation to expire resets.

    The get_id() function is the only function exposed all the others are meant for internal use.

    """

   

    def __init__(self, seconds = 300):
        self.seconds = seconds
        self.conversation_id = None
        self.pconversation_id = None
        self.timer = None
        self.default_conversation = uuid4()
        self.lock = threading.Lock()

    def check(self):
        return (self.timer is None) == (self.conversation_id is None) 

    def set_timer (self, time = None):
        if time is None:
            time = self.seconds
        return threading.Timer(time, self.expire)



    def expire(self):
        """This is the funciton that executes when the user 
        fails to keep the conversation going and the agent has 
        no choice but to drop the old conversation and revert
        to the initial state."""
        with self.lock:
            self.pconversation_id = self.conversation_id
            self.conversation_id, self.timer = None, None




    def get_id(self):
        """This is the only function that is exposed"""
        with self.lock:
            if not self.check(): 
                self.pconversation_id = self.conversation_id
                self.conversation_id, self.timer = None, None

            if not isinstance(self.timer, threading.Timer):
                self.conversation_id, self.timer = uuid4(), self.set_timer()

                self.timer.start()

            
            else:
                if self.timer.is_alive():
                    self.timer.cancel()
                    self.timer = self.set_timer()
                    self.timer.start()
                else:
                    self.pconversation_id = self.conversation_id
                    self.conversation_id, self.timer = uuid4(), self.set_timer()
                    self.timer.start()
                                    
            return self.conversation_id
                
            

        






























# class Conversation:
#     """This function tracks the converstion."""

   

#     def __init__(self):
#         self.conversation_id = None
#         self.timer = None
#         self.default_conversation = uuid4()

#     def check(self):
#         return (self.timer is None) == (self.conversation_id is None) 

#     def set_timer (self, time = 180):
#         return threading.Timer(time, self.expire)



#     def expire(self):
#         """This is the funciton that executes when the user 
#         fails to keep the conversation going and the agent has 
#         no choice but to drop the old conversation and start a 
#         new one"""
#         self.conversation_id, self.timer = None, None




#     def renew(self):
#         """This function renews the timer and retains the 
#         conversation id"""

#         if not isinstance(self.timer, threading.Timer):
#             return "Timer Not Initiated"

#         if not self.timer.is_alive():
#             return "Timer Not Active"

#         self.timer.cancel()
#         self.timer = self.set_timer()
#         self.timer.start()




#     def get_id(self, default = False):

#         if default:
#             self.default_conversation

#         if self.conversation_id is None:
#             return "No Conversation ID available (create a new one)"

        

#         return


        













