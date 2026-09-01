from agent.models.openai_connector import OpenAIModel
from agent.memory import Memory
from agent.agent import Agent, load_user_data, load_tools, load_bootstrap, create_agent
from agent.message_queue import MessageQueue
from history import ChatHistoryManager, AgentHistoryManager
from services.conversations import Conversation
from user import User
from tools.chat.tools import TOOLS
import json







def chat_agent(uuid, message_queue: MessageQueue, ws = None):
    tools = load_tools("agent/tools/chat/tools_chat.json")
    bootstrap = load_bootstrap("agent/agent_bootstrap/chat/")
    user_data = load_user_data(uuid)

    conversation_manager = Conversation()

    chat_history = ChatHistoryManager(conversation_manager)
    agent_history = AgentHistoryManager()



    memo = Memory(tools=tools, bootstrap=bootstrap, user_data=user_data, chat_history=chat_history, agent_history=agent_history)
    mod = OpenAIModel()
    user = User(uuid)

    agent1 = Agent(user=user,model=mod, memory=memo, tool_registry=TOOLS)



    message = message_queue.get_messages()

    def loop():

        while True:

            memory_dump = agent1.build_message(dump_all=True)

            
            agent1.ask(message=message)


            

    loop()

        


    












if __name__ == "__main__":

    mq = MessageQueue(5)

    mq.add_message("Hey I need to complete my Math assignment by Today before midnight. Can you create a reminder for me")

    mq.add_message("Hey how I have been doing these past few days.")


    


















