import {useState} from "react";
import { SafeAreaView, StyleSheet, TextInput, } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";

const sendText = async (phoneNumber) => {
  console.log("PhoneNumber: ",phoneNumber);
  await fetch("https://dev.stedi.me/twofactorlogin/"+phoneNumber,{
    method: "POST",
    headers:{
      "content-type":"application/text"
    }
  });
}

const getToken = async ({phoneNumber, oneTimePassword, setUserLoggedIn}) => {

  // setUserLoggedIn(true)

  const tokenResponse = await fetch('https://dev.stedi.me/twofactorlogin',{
    method: 'POST',
    body:JSON.stringify({oneTimePassword, phoneNumber}),
    headers: {
      'content-type': 'application/json'
    }
  });

  const responseCode = tokenResponse.status;//200 means logged in successfully
  console.log("Response Status Code", responseCode);
  if(responseCode==200){
    setUserLoggedIn(true);
  }

  const tokenResponseString = await tokenResponse.text();
  console.log("Token",tokenResponseString);

  const getUsername = await fetch("https://dev.stedi.me/validate/"+tokenResponseString)

  const getUsernameString = await getUsername.text();
  console.log("Username",getUsernameString)
}





const Login = (props) => {
  // const [count, setCount] = useState(0);
  // const onPress = () => setCount(prevCount => prevCount + 1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oneTimePassword, setOneTimePassword] = useState(null);

  return (
    <SafeAreaView style={styles.mainView}>
      <TextInput
        style={styles.input}
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        placeholder = "360-984-1155"
        placeholderTextColor = "#add8e6"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={()=>{
          sendText(phoneNumber)
        }}
      >
        <Text>Send Text</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        onChangeText={setOneTimePassword}
        value={oneTimePassword}
        placeholder="1234"
        placeholderTextColor = "#add8e6"
        keyboardType="numeric"
        secureTextEntry = {true}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={()=>{
         
          getToken({phoneNumber, oneTimePassword, setUserLoggedIn:props.setUserLoggedIn});
        }}
      >
        <Text>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  mainView:{
    marginTop:100
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  countContainer: {
    alignItems: "center",
    padding: 10
  }
});

export default Login;