# App — Expo / React Native

[← Back to project README](../README.md)


























## Table of Contents

- [Stack](#stack)
- [Setup](#setup)
- [Running](#running)
- [Routing](#routing)
- [State & Theming](#state--theming)
- [Structure](#structure)

## Stack

| Package | Role |
|---|---|
| `expo` / `expo-router` |  |
| `react-native` / `react` |  |
| `typescript` |  |
| `react-native-paper` |  |
| `react-native-reanimated` / `react-native-gesture-handler` |  |
| `react-native-draggable-flatlist` |  |
| `react-native-chart-kit` / `react-native-svg` |  |
| `@react-native-async-storage/async-storage` |  |
| `@react-native-community/datetimepicker` |  |

## Setup

```bash
cd MyProgressManager
npm install
```


























```bash
cp constants/config.ts.example constants/config.ts
```

```ts
export const API_BASE_URL = "";
export const AUTH_TOKEN_STORAGE_KEY = "";
```

> [!TIP]
> 

## Running

```bash
npm start
npm run ios
npm run android
npm run web
npm run lint
```


























> [!TIP]
> 

## Routing


























<pre>
app
├── <a href="app/_layout.tsx">_layout.tsx</a>             #
├── <a href="app/index.tsx">index.tsx</a>               #
├── <a href="app/index2.tsx">index2.tsx</a>              #
└── <a href="app/%28tabs%29/">(tabs)</a>
    ├── <a href="app/%28tabs%29/_layout.tsx">_layout.tsx</a>         #
    ├── <a href="app/%28tabs%29/home.tsx">home.tsx</a>            #
    ├── <a href="app/%28tabs%29/streak.tsx">streak.tsx</a>          #
    ├── <a href="app/%28tabs%29/stats.tsx">stats.tsx</a>           #
    ├── <a href="app/%28tabs%29/profile.tsx">profile.tsx</a>         #
    └── <a href="app/%28tabs%29/loginSignup.tsx">loginSignup.tsx</a>     #
</pre>

## State & Theming


























| Context | Role |
|---|---|
| [`AuthProvider`](context/AuthProvider.tsx) |  |
| [`ThemeContext`](context/ThemeContext.tsx) |  |
| [`TypographyContext`](context/TypographyContext.tsx) |  |
| [`AgentContext`](context/AgentContext.tsx) |  |
| [`LoadingContext`](context/LoadingContext.tsx) |  |

## Structure

<pre>
MyProgressManager
├── <a href="package.json">package.json</a>                #
├── <a href="app.json">app.json</a>                    #
├── <a href="app/">app</a>                         #
├── <a href="components/">components</a>                  #
├── <a href="context/">context</a>                     #
├── <a href="services/">services</a>                    #
├── <a href="styles/">styles</a>                      #
├── <a href="constants/">constants</a>                   #
├── <a href="hooks/">hooks</a>                       #
├── <a href="utils/">utils</a>                       #
├── <a href="types/types.ts">types/types.ts</a>              #
└── <a href="assets/">assets</a>                      #
</pre>


























---

**[↑ Back to top](#app--expo--react-native)**
