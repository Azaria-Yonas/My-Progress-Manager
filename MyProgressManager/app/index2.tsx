import React, { useState } from "react"

type LoginResponse = {
    status: string
    email: string
    password: string
}

export default function LoginTest() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [response, setResponse] = useState<LoginResponse | null>(null)


    const sendLogin = async () => {

        const res = await fetch("https://my-progress-manager.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        const data = await res.json()

        setResponse(data)
    }


    return (
        <div style={{ padding: 40 }}>

            <h2>Flask Login Test</h2>

            <input
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={sendLogin}>
                Login
            </button>

            <h3>Response</h3>

            <pre>
                {JSON.stringify(response, null, 2)}
            </pre>

        </div>
    )
}

// // app/index2.tsx
// import React, { useEffect, useState } from "react";
// import { View } from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withDelay,
// } from "react-native-reanimated";
// import { useRouter } from "expo-router";
// import { LinearGradient } from "expo-linear-gradient";

// import { styles } from "../styles/IndexStyles2";
// import SpinningLogo from "../components/SpinningLogo";
// import { supabase } from "../lib/supabaseClient";

// export default function Index() {
//   const router = useRouter();
//   const [redirectTo, setRedirectTo] = useState<string | null>(null);

//   const titleOpacity = useSharedValue(0);
//   const subtitleOpacity = useSharedValue(0);

//   useEffect(() => {
//     titleOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
//     subtitleOpacity.value = withDelay(1600, withTiming(1, { duration: 800 }));
//   }, []);

//   const titleAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: titleOpacity.value,
//   }));

//   const subtitleAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: subtitleOpacity.value,
//   }));

//   useEffect(() => {
//     const timer = setTimeout(async () => {
//       const { data } = await supabase.auth.getSession();

//       if (data.session) {
//         setRedirectTo("/(tabs)/home");
//       } else {
//         setRedirectTo("/(tabs)/loginSignup");
//       }
//     }, 4000);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (redirectTo) {
//       router.replace(redirectTo as any);
//     }
//   }, [redirectTo]);

//   return (
//     <View style={{ flex: 1 }}>
//       <LinearGradient
//         colors={["#6AB5DE", "#5A57BA"]}
//         start={{ x: 0, y: 0.5 }}
//         end={{ x: 1, y: 0.5 }}
//         style={{ flex: 1 }}
//       />

//       <View
//         style={[
//           styles.container,
//           {
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//           },
//         ]}
//       >
//         <SpinningLogo
//           source={require("../assets/images/suitcase.png")}
//           size={150}
//           style={{ marginBottom: 20 }}
//         />

//         <Animated.Text style={[styles.title, titleAnimatedStyle]}>
//           MY Progress Manager
//         </Animated.Text>

//         <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
//           Stay Organized | Measure Progress | Win
//         </Animated.Text>
//       </View>
//     </View>
//   );
// }
