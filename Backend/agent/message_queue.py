from queue import Queue
from datetime import datetime


TIME_OUT = 360.00

class MessageQueue(Queue):
    def __init__ (self, max_size = 0):

        super().__init__(max_size)


    def add_message(self, message):
        node = dict()

        node["User Message"] = message
        node["Time"] = datetime.now()

        super().put(node)

    def get_messages(self):
        items = list()
        while not super().empty():
            items.append(super().get_nowait())

        return items

    def listen(self, timeout = TIME_OUT):
        return super().get(timeout=timeout) 



    


        

       
















        