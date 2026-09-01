from sqlalchemy import create_engine, DateTime, func, Row
from sqlalchemy import String, text, Uuid, Select, ForeignKey, true
from sqlalchemy.dialects.sqlite import DATETIME, JSON
from sqlalchemy.orm import DeclarativeBase, declarative_base, Mapped, mapped_column
from sqlalchemy.orm import Session, relationship
from services.conversations import Conversation

from uuid import uuid4, UUID
from datetime import datetime
from pathlib import Path
from sqlite3 import connect


ENGINE =create_engine("sqlite:///agent/history.db") 
 
BASE = declarative_base()



def create_database(): 
    if not Path("agent/history.db").is_file(): 
        connect("history.db")


def initialize_db():
    BASE.metadata.create_all(ENGINE)







class ChatHistory(BASE):
    """This function records the visisble chat history between 
    the user and the agent"""

    __tablename__ = "chat_history"

    conversation_id: Mapped[UUID] = mapped_column(Uuid, nullable=False)
    message_id : Mapped[UUID] =  mapped_column(Uuid, primary_key=True, default=uuid4)
    user : Mapped[str] = mapped_column(String(10))
    message : Mapped[str] = mapped_column(String)
    date : Mapped[datetime] = mapped_column(DATETIME(timezone = True), server_default=func.now(), index=True)
    status: Mapped[str] = mapped_column(String(20), server_default=text("'active'"), index=True)

    agent_history = relationship("message_id", back_populates="message_id"),

    def __repr__(self):
        return f"{self.user} :  {self.message}"





class AgentHistory(BASE):
    """This function records all the behind the scene outputs from all the 
    requests that are going to the LLM"""

    __tablename__ = "agent_history"

    id : Mapped[UUID] =  mapped_column(Uuid, primary_key=True, default=uuid4)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)
    output: Mapped[dict] = mapped_column(JSON)
    message_id : Mapped[UUID] = mapped_column(Uuid)

    chat_history = relationship("agent_history", back_populates="chat_history")













class ChatHistoryManager:
    chat_history = ChatHistory
    def __init__ (self, conversation: Conversation):
        self.conversation_manager = conversation
        self.previous_id = None

    def get_id(self):
        if self.previous_id is None:
            self.previous_id = self.conversation_manager.get_id
        else:
            if not (self.previous_id == self.conversation_manager.get_id()):
                self.previous_id = self.conversation_manager.get_id()
        return self.conversation_manager.get_id



    def append(self, user, message):
        with Session(ENGINE) as session:
            conversation_id = self.get_id()
            


            chat = self.chat_history(conversation_id = conversation_id, message= message, user = user )

            session.add(chat)
            session.commit()



    def deactivate(self, conversation_id = None): 
        """Essential this function updates the status column of a entry on the chat_history 
        table from 'active' to 'inactive,' meaning it is no longer injected to the agents 
        context.

        It takes a optional parameter, conversation_id, which removes all messages within that 
        conversation
        from the agents context"""




        with Session(ENGINE) as sesssion:
            if conversation_id is None:
                sesssion.execute(text("UPDATE chat_history SET status = 'inactive' WHERE status = 'active'"))
            else:
                sesssion.execute( text("UPDATE chat_history SET status = 'inactive' WHERE conversation_id =: conversation_id"), {"conversation_id" : conversation_id})
        
            sesssion.commit()



    def history(self):
        """This function returns the active history. It starts by checking if the lastest conversation_id generated matches
        the active conversation in the database. If so it returns the active chat otherwise the active chat is deactivated 
        and a new active chat is started"""
        with Session(ENGINE) as sessions:
            results = sessions.execute(text("SELECT conversation_id, user, message FROM chat_history WHERE status = 'active'"))
            output =  results.one_or_none()
            if output is not None:
                if not (output[0][0] == self.get_id()):
                    self.deactivate()
                    return {}

                else:
                    return output
            return {}


    def browse_memory(self):
        """This function allows the agent to look at history that isn't active but could be used for context"""





        



class AgentHistoryManager:
    agent_history = AgentHistory

    def __init__(self):
        pass


    @classmethod
    def append(cls, output, message_id):
        """This function apppends every output of the agent, mapping it 
        to the corresponding message sent to the user in the ChatHistory. 
        In other words, this table stores the output of every api call for 
        every message sent back to the user."""

        with Session(ENGINE) as session:
            new_row = cls.agent_history(message_id= message_id, output = output)
            session.add(new_row)
            session.commit()


    @classmethod
    def history(cls, message_id):
        with Session(ENGINE) as sessions:
            results = sessions.execute(text("SELECT output FROM your_table WHERE message_id = :message_id"), {"message_id": message_id},)

            return results.one_or_none()














































