from agent.create_agent import create_agent














def agentic_loop(uuid, conversation_manager, message_queue, ws, MAX_ITERATION):
    agent = create_agent(uuid, conversation_manager)




    for i in range(MAX_ITERATION):
        message = message_queue.get_message()

        agent.ask(message)

        


    




    













if __name__ == "__main__":
    ...











