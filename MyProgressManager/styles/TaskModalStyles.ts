// styles/TaskModalStyles.ts
import { StyleSheet } from "react-native";

export const createTaskModalStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 18,
      marginHorizontal: 16,
      borderRadius: 10,
      backgroundColor: theme.card,          
      shadowColor: theme.shadowcolor,        
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 4,
    },

    title: {
      marginTop: 1,
      marginBottom: 10,
      textAlign: "center",
      color: theme.text,                    
    },

    input: {
      marginBottom: 12,
      backgroundColor: theme.input,     
    },

    row: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 10,
    },

    button: {
      marginLeft: 8,
    },

    label: {
      marginBottom: 8,
      color: theme.text,                    
    },

    colorRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 15,
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center",
      width: "90%",
    },
    

    colorButton: {
      marginBottom: 6,
      width: 38,
      height: 38,
      borderRadius: 30,
      borderWidth: 1.5,
      borderColor: theme.text + "40",       
    },

    datePickerContainer: {
      alignItems: "center",
      marginVertical: 10,
    },
  });




// // styles/TaskModalStyles.ts
// import { StyleSheet } from "react-native";

// export const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     marginHorizontal: 16,
//     borderRadius: 8,
//   },

//   title: {
//     marginBottom: 16,
//     textAlign: "center",
//   },

//   input: {
//     marginBottom: 12,
//   },

//   row: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },

//   button: {
//     marginLeft: 8,
//   },

//   label: {
//     marginBottom: 8,
//   },

//   colorRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginBottom: 15,
//     marginTop: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     width: "90%",
//   },

//   colorButton: {
//     marginBottom: 6,
//     width: 38,
//     height: 38,
//   },

//   datePickerContainer: {
//     alignItems: "center",
//     marginVertical: 10,
//   },
// });
