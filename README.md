# Ledger


<p align="center">
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Router-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo Router" />
  <img src="https://img.shields.io/badge/Paper-6200EE?style=flat-square&logo=react&logoColor=white" alt="React Native Paper" />
  <img src="https://img.shields.io/badge/Reanimated-001A72?style=flat-square&logo=react&logoColor=white" alt="Reanimated" />
  <img src="https://img.shields.io/badge/Chart_Kit-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" alt="React Native Chart Kit" />
  <img src="https://img.shields.io/badge/SVG-FFB13B?style=flat-square&logo=svg&logoColor=black" alt="React Native SVG" />
  <br>
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Postgres-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Anthropic-D97757?style=flat-square&logo=anthropic&logoColor=white" alt="Anthropic" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black" alt="Render" />
  <img src="https://img.shields.io/badge/MIT-blue?style=flat-square" alt="MIT License" />
</p>

<p align="center">
  <img src="MyProgressManager/assets/images/suitcase.png" width="22%" alt="My Progress Manager logo">
</p>



Ledger (previously named MyProgressManager) is a app that manages 


The app itself primarily exists as a wrapper for a agentic system that I created. 

I created this agent with no orchestration frameworks and no SDKs and defined all functionalities myself


This agentic system is multi - teared and the agent is allowed to control itself in that it can select a and choose


This system that I created optimized token consumption.

I implement things such as empheral storage along with long terms storage and 








The most important part of this project is the agent and I have left way more resources at [here](Backend/agent/README.md)









## Demo

### App Walkthrough

https://github.com/user-attachments/assets/969d04d9-ff20-4978-814d-cb497c4e4323

























### Agent Setup

https://github.com/user-attachments/assets/33861736-22db-4dc4-a886-c70653b66b4e

























## Table of Contents

- [Demo](#demo)
  - [App Walkthrough](#app-walkthrough)
  - [Agent Setup](#agent-setup)
- [Overview](#overview)
- [Features](#features)
  - [Tasks](#tasks)
  - [Streaks](#streaks)
  - [Stats](#stats)
  - [The Agent](#the-agent)
  - [Theme & Typography](#theme--typography)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
- [Project Structure](#project-structure)
- [Project Status](#project-status)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)
- [Contact](#contact)

## Overview

























- ****  — 
- ****  — 
- ****  — 

























## Features

### Tasks

- ****  — 
- ****  — 
- ****  — 
- ****  — 

### Streaks

- ****  — 
- ****  — 
- ****  — 
- ****  — 

### Stats

- ****  — 
- ****  — 
- ****  — 

### The Agent

- ****  — 
- ****  — 
- ****  — 
- ****  — 

> [!IMPORTANT]
> 

### Theme & Typography

- ****  — 
- ****  — 
- ****  — 

## Architecture

```
┌─────────────────────────┐
│   Expo / React Native   │   iOS · Android · Web
│   (MyProgressManager)   │
└───────────┬─────────────┘
            │
            │
            ▼
┌─────────────────────────┐
│    Flask API (Backend)  │
│                         │
└─────┬──────────────┬────┘
      │              │
      │              └────────────►
      ▼
┌─────────────────────────┐
│  Supabase Postgres      │
│                         │
└─────────────────────────┘
```

























## Documentation

Each part of the stack has its own README.

| | Covers |
|---|---|
| **[App](MyProgressManager/README.md)** | Expo setup, running on device and web, routing, theming |
| **[Backend](Backend/README.md)** | Flask setup, full API reference, the agent, deployment |
| **[Database](Database/README.md)** | Supabase schema, row-level security, applying `public.sql` |

## Getting Started

### Prerequisites

- ****  — 
- ****  — 
- ****  — 
- ****  — 

### Clone the Repository

```bash
git clone https://github.com/Azaria-Yonas/My-Progress-Manager.git
cd My-Progress-Manager
```

























Then follow the README for the part you're working on: [App](MyProgressManager/README.md), [Backend](Backend/README.md), [Database](Database/README.md).

## Project Structure

<pre>
My-Progress-Manager
├── <a href="README.md">README.md</a>
├── <a href="LICENSE">LICENSE</a>
├── <a href="CONTRIBUTING.md">CONTRIBUTING.md</a>
├── <a href="CODE_OF_CONDUCT.md">CODE_OF_CONDUCT.md</a>
├── <a href="SECURITY.md">SECURITY.md</a>
├── <a href=".github/">.github</a>
│   ├── <a href=".github/ISSUE_TEMPLATE/bug-report.md">ISSUE_TEMPLATE/bug-report.md</a>
│   └── <a href=".github/pull_request_template.md">pull_request_template.md</a>
│
├── <a href="MyProgressManager/">MyProgressManager</a>       
│   ├── <a href="MyProgressManager/package.json">package.json</a> 
│   ├── <a href="MyProgressManager/app.json">app.json</a>  
│   ├── <a href="MyProgressManager/app/">app</a>
│   │   ├── <a href="MyProgressManager/app/_layout.tsx">_layout.tsx</a>  
│   │   ├── <a href="MyProgressManager/app/index.tsx">index.tsx</a>  
│   │   ├── <a href="MyProgressManager/app/index2.tsx">index2.tsx</a>  
│   │   └── <a href="MyProgressManager/app/%28tabs%29/">(tabs)</a>
│   │       ├── <a href="MyProgressManager/app/%28tabs%29/_layout.tsx">_layout.tsx</a>  
│   │       ├── <a href="MyProgressManager/app/%28tabs%29/home.tsx">home.tsx</a>  
│   │       ├── <a href="MyProgressManager/app/%28tabs%29/streak.tsx">streak.tsx</a>
│   │       ├── <a href="MyProgressManager/app/%28tabs%29/stats.tsx">stats.tsx</a> 
│   │       ├── <a href="MyProgressManager/app/%28tabs%29/profile.tsx">profile.tsx</a>  
│   │       └── <a href="MyProgressManager/app/%28tabs%29/loginSignup.tsx">loginSignup.tsx</a>
│   ├── <a href="MyProgressManager/components/">components</a>        
│   ├── <a href="MyProgressManager/context/">context</a>           
│   ├── <a href="MyProgressManager/services/">services</a>          
│   ├── <a href="MyProgressManager/styles/">styles</a>            
│   ├── <a href="MyProgressManager/constants/">constants</a>         
│   ├── <a href="MyProgressManager/hooks/">hooks</a>             
│   ├── <a href="MyProgressManager/utils/">utils</a>             
│   ├── <a href="MyProgressManager/types/types.ts">types/types.ts</a>    
│   └── <a href="MyProgressManager/assets/">assets</a>            
│
├── <a href="Backend/">Backend</a>                   
│   ├── <a href="Backend/app.py">app.py</a>            
│   ├── <a href="Backend/config.py">config.py</a>         
│   ├── <a href="Backend/requirements.txt">requirements.txt</a>
│   ├── <a href="Backend/auth/auth.py">auth/auth.py</a>      
│   ├── <a href="Backend/routes/">routes</a>            
│   ├── <a href="Backend/services/streak_timer.py">services/streak_timer.py</a>
│   ├── <a href="Backend/clients/">clients</a>           
│   ├── <a href="Backend/env/env.md">env/env.md</a>        
│   └── <a href="Backend/agent/">agent</a>
│       ├── <a href="Backend/agent/agent.py">agent.py</a>      
│       ├── <a href="Backend/agent/agentic_loop.py">agentic_loop.py</a>
│       ├── <a href="Backend/agent/agent_bootstrap/">agent_bootstrap</a>
│       ├── <a href="Backend/agent/models/">models</a>        
│       └── <a href="Backend/agent/tools/">tools</a>         
│
├── <a href="Database/">Database</a>
│   ├── <a href="Database/public.sql">public.sql</a>        
│   └── <a href="Database/mydb/">mydb</a>              
│
└── <a href="Auxiliary%20and%20Resources/">Auxiliary and Resources</a>   
</pre>

## Project Status

























| Area | Status |
|---|---|
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |



## Acknowledgements

This project began as a clone of [Task-Manager-ReactNative](https://github.com/hoangsonww/Task-Manager-ReactNative)
by [Son Nguyen](https://github.com/hoangsonww). They laid out the initial React Native and Expo task-manager foundation. Shout out to them for putting it out there. My project has since changed a lot.
I added a separate Flask backend, and the Supabase Postgres schema was built from scratch for this project, as was the Agent. Not only that, but the frontend was rewritten, with more screens and lots of new features. However, a lot of the elements remain unchanged. UI components such as the draggable flat screen, task items, and task add modal are about the same as in the original repo, only adapted to my project. Once again, thanks to the original creators.



## Contributing


See [CONTRIBUTING.md](CONTRIBUTING.md), the [Code of Conduct](CODE_OF_CONDUCT.md),
and [SECURITY.md](SECURITY.md).

































## License

See [LICENSE](LICENSE).

## Contact

- **Website:** [azariayonas.com](https://azariayonas.com)
- **GitHub:** [@Azaria-Yonas](https://github.com/Azaria-Yonas)
- **Email:** [azariahsworld22@gmail.com](mailto:azariahsworld22@gmail.com)

---

























**[↑ Back to top](#my-progress-manager)**
