# Agent


This right here is the most important part of my app.


This agent that I created is was created with no orchestration tools or SDKs. 


This agent was optimized to for token efficeincy and completeting 



lets look at the agent from the top down

in Backend/app.py begins with the flask application being started along with the initialization of the database for storing the chat history and the agent history (We will get into the difference between those two).


Initially the message agent route was a pure flask endpoint meaning it was communicating with the backend via http requests. 