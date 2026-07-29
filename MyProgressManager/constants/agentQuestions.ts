// constants/agentQuestions.ts

export interface AgentQuestion {
  id: string;
  prompt: string;
  helper: string;
  placeholder: string;
  suggestions: string[];
  multiline?: boolean;
}

export const AGENT_NAME_SUGGESTIONS = [
  "Abebe",
  "Mekonnen",
  "Abel",
  "Selam",
  "LeBron",
];

export function buildAgentQuestions(firstName?: string | null): AgentQuestion[] {
  const name = (firstName ?? "").trim();

  const callYouSuggestions = name
    ? [
        `Just call me ${name}`,
        "I give you the honor of giving me a nickname",
        "Keep it casual, no name needed",
      ]
    : [
        "Call me by my first name",
        "Use a nickname I give you",
        "Keep it casual, no name needed",
      ];

  return [
    {
      id: "call_you",
      prompt: "Nicknames are more memorable. What should I call you?",
      helper: "This is how I will refer to you throughout.",
      placeholder: "Type a name or nickname",
      suggestions: callYouSuggestions,
    },
    {
      id: "help_with",
      prompt: "You are here because you are focused, dedicated, and want to get things done. But, What exactly would you like my help with?",
      helper: "Pick what matters most right now.",
      placeholder: "You can spill your ideas right here!",
      suggestions: [
        "Building habits",
        "Managing my goals",
        "Homework tracking",
        "Tracking progress",
        "Staying motivated",
        "Nothing in particular",
      ],
      multiline: true,
    },
    {
      id: "encouragement",
      prompt: "Everybody needs encouragement. What kind of person are you? What type of encouragement motivates you?",
      helper: "I will lean on this when you need a push.",
      placeholder: "What actually gets you moving?",
      suggestions: [
        "Celebrate my small wins",
        "Remind me why I started",
        "Show me my progress and milestones",
        "A little competition",
        "Calm, nothing extra",
        "Keep it minimal",
      ],
      multiline: true,
    },
    {
      id: "tone",
      prompt: "Tone changes how messages are recieved. What tone should I use with you?",
      helper: "How I sound when we talk.",
      placeholder: "Describe the tone you prefer",
      suggestions: [
        "Warm and friendly",
        "Direct and to the point",
        "Playful and a bit funny",
        "Military/Coach-like and firm",
        "Balanced",
      ],
    },
    {
      id: "accountability_style",
      prompt: "Some of us work better when we are challenged. Should I challenge you when you're falling behind or be more supportive?",
      helper: "There is no wrong answer here.",
      placeholder: "Challenge me, support me, or a mix",
      suggestions: [
        "Challenge me, push me harder",
        "Be supportive",
        "A mix of both depending on the week",
        "Just give me the facts, nothing else",
      ],
      multiline: true,
    },
    {
      id: "goals",
      prompt: "Somethings matter more. What are your primary goals?",
      helper: "The bigger things you are working toward.",
      placeholder: "You can share a mix of your long and short term goals.",
      suggestions: [
        "Build healthy habits",
        "Get consistent with fitness",
        "Nothing specific",
      ],
      multiline: true,
    },
    {
      id: "habits",
      prompt: "Small changes make big differences over time. What habits are you trying to build?",
      helper: "The small daily things that add up.",
      placeholder: "List the habits you care about",
      suggestions: [
        "Reading every day",
        "Morning workouts",
        "Studying at a set time",
        "Journaling",
        "Less screen time",
      ],
      multiline: true,
    },
    {
      id: "avoid",
      prompt: "Boundaries are very important. Is there anything you want me to avoid?",
      helper: "Boundaries I should respect.",
      placeholder: "Feel free to tell me anything that is off limits?",
      suggestions: [
        "Keep messages short",
        "Nothing, say it straight",
      ],
      multiline: true,
    },
  ];
}
