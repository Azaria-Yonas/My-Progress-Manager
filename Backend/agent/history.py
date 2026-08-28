from sqlalchemy import create_engine, DateTime, func
from sqlalchemy import String, text, Uuid, Select, ForeignKey, true
from sqlalchemy.dialects.sqlite import DATETIME, JSON, BOOLEAN
from sqlalchemy.orm import DeclarativeBase, declarative_base, Mapped, mapped_column
from sqlalchemy.orm import Session


from uuid import uuid4, UUID
from datetime import datetime
from pathlib import Path
from sqlite3 import connect


ENGINE =create_engine("sqlite:///agent/history.db") 
 
BASE = declarative_base()



def create_database(): 
    if not Path("agent/my_database.db").is_file(): 
        connect("history.db")


def initialize_db():
    BASE.metadata.create_all(ENGINE)










class ChatHistory(BASE):
    """This function records the chat history between 
    the user and the agent"""

    __tablename__ = "chat_history"

    conversation_id: Mapped[UUID] = mapped_column(Uuid, default=uuid4)
    message_id : Mapped[UUID] =  mapped_column(Uuid, primary_key=True, default=uuid4)
    user : Mapped[str] = mapped_column(String(10))
    message : Mapped[str] = mapped_column(String)
    date : Mapped[datetime] = mapped_column(DATETIME(timezone = True), server_default=func.now(), index=True)
    status: Mapped[str] = mapped_column(String(20), server_default=text("'active'"), index=True)

    


    @classmethod
    def append(cls, user, message):
        with Session(ENGINE) as session:
            chat = cls(message= message, user = user)

            session.add(chat)
            session.commit()


    @classmethod
    def get_history(cls, active =False):
        with Session(ENGINE) as session:

            if active == True:
                stmt = Select(cls).where(cls.status == 'active')

                

        



    def __repr__(self):
        return f"{self.user} :  {self.message}"






class AgentHistory(BASE):
    """This function records all the outputs from all the 
    requests that are going to the agent"""

    __tablename__ = "agent_history"

    id : Mapped[UUID] =  mapped_column(Uuid, primary_key=True, default=uuid4)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)
    output: Mapped[dict] = mapped_column(JSON)
    message_id : Mapped[UUID] = mapped_column(Uuid, ForeignKey("chat_history.message_id"))






















