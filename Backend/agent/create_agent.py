from agent.bootstrap.bootstrap import Bootstrap
from agent.models.openai_connector import OpenAIModel
from agent.tools.tools import load_tools
from agent.agent import Agent
from agent.history import AgentHistoryManager, ChatHistoryManager
from agent.memory import Memory
from agent.user import User












def create_agent(user_id, conversation_manager):

    user_data = User(uuid=user_id)
    model = OpenAIModel()


    chat_history = ChatHistoryManager(user_data.user_id, conversation_manager)
    agent_history = AgentHistoryManager()

    instructions = Bootstrap()

    tools = load_tools()
    
    memory = Memory(agent_history=agent_history, chat_history=chat_history, bootstrap=instructions, user_data=user_data)
    


    agent = Agent(user= user_data, model= model, memory=memory)




    