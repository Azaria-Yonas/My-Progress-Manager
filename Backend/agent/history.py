import sqlite3
from sqlalchemy import Column, create_engine, Integer, Table, DateTime, func
from sqlalchemy import String, text, Uuid, Insert, Select, ForeignKey
from sqlalchemy.dialects.sqlite import DATETIME, JSON
from sqlalchemy.orm import DeclarativeBase, declarative_base, Mapped, mapped_column
from sqlalchemy.orm import sessionmaker


from uuid import uuid4, UUID
from datetime import datetime

conn = sqlite3.connect("chat_history.db")



class ChatHistory(declarative_base()):
    """This function records the chat history between 
    the user and the agent"""

    __tablename__ = "chat_history"

    message_id : Mapped[UUID] =  mapped_column(Uuid, primary_key=True, default=uuid4)
    user : Mapped[str] = mapped_column(String(10))
    message : Mapped[str] = mapped_column(String)
    date : Mapped[datetime] = mapped_column(DATETIME(timezone = True), server_default=func.now(), index=True)






class AgentHistory(declarative_base()):
    """This function records all the outputs from all the 
    requests that are going to the agent"""

    __tablename__ = "agent_history"

    id : Mapped[UUID] =  mapped_column(Uuid, primary_key=True, default=uuid4)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)
    output: Mapped[dict] = mapped_column(JSON)
    message_id : Mapped[UUID] = mapped_column(Uuid, ForeignKey = ForeignKey("chat_history.message_id"))


















