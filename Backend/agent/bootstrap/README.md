
# Agent Bootstrap 

- This sub directory contains the Bootstrap files for the agent. This is everything it needs to know to fulfill its function the way it was intended to.

- There are three primary agents and the each have their own set of bootstrap files.

## File Layout and descriptions

### Chat

<pre>
chat/
├── <a href="chat/AGENT.md">AGENT.md</a>        — The agent's role 
├── <a href="chat/APP.md">APP.md</a>          — About the app Ledger
├── <a href="chat/SCOPE.md">SCOPE.md</a>        — Answers which subjects are in scope 
├── <a href="chat/IMPORTANT.md">IMPORTANT.md</a>    — Important Characteristics + Error Messages
├── <a href="chat/PERSONALITY.md">PERSONALITY.md</a>  — The agent's Personality
├── <a href="chat/DETAILS.md">DETAILS.md</a>      — What the output shoudl look + token limits
├── <a href="chat/USER.md">USER.md</a>         — About the user
└── <a href="chat/TEST.md">TEST.md</a>         — Only useful for testing
</pre>




### Orchestrator

- 
- 
- 






### Summarizer


- 
- 
- 







##  Prompt Engineering

### The Challenge

One of the challenges of creating this agent was making sure that it serves its purpose and its purpose only.

I wanted to make sure that the user is using the agent in the intended way and that tokens aren't being used for anything else.

However, this is much easier said than done. I will give two examples:

In the bootstrap files for the chat agent, I redundantly expressed how I didn't want the agent to respond to questions that aren't in the scope of this app, as defined in [SCOPE.md](chat/SCOPE.md). Here are some of the things I explicitly told my agent not to respond to: general knowledge, news, weather, sports, politics, opinions, etc.

For most questions asked, the agent was able to quickly pick up that it was a question it wasn't supposed to respond to, but for others it kept on failing.

One example of this is when you couple a legitimate request with one that isn't.

#### Example 1

In this example, the first call asks the agent to give him the answer to 1+1. However, the agent was able to know that this wasn't in the [scope](chat/SCOPE.md) of this app and so responded with an error message.

In the second function call, I preceded the same prompt (what is 1+1) with a question that is in the [scope](chat/SCOPE.md) of this app, and this resulted in the agent responding to both prompts, while it should have ignored the second.

<p align="center">
  <img src="../../../Auxiliary%20and%20Resources/Prompt%20Engineering.png" width="100%" alt="Prompt Engineering example">
</p>

#### Example 2

In this example, I did about the same thing, except I asked it to summarize a long story for me too. Funny enough, it ignored all the many times I told it not to respond to things as such. And this shows how this could be a very expensive problem if there isn't a way to limit what the agent does.

<p align="center">
  <img src="../../../Auxiliary%20and%20Resources/Prompt%20Engineering%202.png" width="100%" alt="Prompt Engineering example 2">
</p>

### The Fix

Generally speaking, there is no absolute fix for prompt injection, and making my [Agent bootstrap files](chat/) much more verbose will likely just increase the per request cost.

And so my solution was limiting the **max input** and **output tokens** inorder to minimize token wastage. Opting out for a smarter model (or simpley increasing reasoning capabilities) made it so that I can compress the bootstrap files while getting better results.







