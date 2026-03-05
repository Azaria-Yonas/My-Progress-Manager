// app/index.tsx

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function Index() {

  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const sendNumbers = async () => {

    try {

      const response = await fetch("http://10.251.251.153:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          a: Number(num1),
          b: Number(num2),
        }),
      });

      const data = await response.json();

      setResult(data.result);

    } catch (error) {
      console.log("API ERROR:", error);
    }

  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Backend Connection Test</Text>

      <TextInput
        style={styles.input}
        placeholder="First Number"
        keyboardType="numeric"
        value={num1}
        onChangeText={setNum1}
      />

      <TextInput
        style={styles.input}
        placeholder="Second Number"
        keyboardType="numeric"
        value={num2}
        onChangeText={setNum2}
      />

      <TouchableOpacity style={styles.button} onPress={sendNumbers}>
        <Text style={styles.buttonText}>Send to Backend</Text>
      </TouchableOpacity>

      {result !== null && (
        <Text style={styles.result}>Result: {result}</Text>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#398de6",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  result: {
    marginTop: 30,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },

});







// // app/index.tsx
// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useRouter } from "expo-router";

// export default function Index() {
//   const router = useRouter();

//   const handleBegin = () => {
//     router.push("/index2");
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.title}>Welcome</Text>
//         <Text style={styles.body}>
//           Press Load App to Begin
//         </Text>
//       </View>

//       <TouchableOpacity style={styles.button} onPress={handleBegin}>
//         <Text style={styles.buttonText}>Load App</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "space-between",
//     backgroundColor: "#fff",
//     padding: 20,
//   },
//   content: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   body: {
//     fontSize: 16,
//     textAlign: "center",
//     color: "#555",
//     lineHeight: 24,
//   },
//   button: {
//     backgroundColor: "#398de6ff",
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginBottom: 30,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });
