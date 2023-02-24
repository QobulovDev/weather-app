import { useState } from 'react';
import { 
  ImageBackground, 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  ActivityIndicator
} from 'react-native';

export default function App() {
  const [input, setInput] = useState("Samarkand");
  const [load, setLoad] = useState(false);
  const [res, setRes] = useState("");
  const [errStatus, setErrStatus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const api = {
    key: "96cd9a48d7cd1602836ab80d13c2b540",
    baseUrl: "https://api.openweathermap.org/data/2.5/",
    // baseUrl: "https://api.openweathermap.org/data/2.5/weather?q=Samarqand&units=metric&appid=96cd9a48d7cd1602836ab80d13c2b540",
  }
  async function submitHandler() {
    let inputReq = input.trim()
    if(!inputReq || inputReq.length<3) return;
    try {
      setLoad(true)
      setRes("")
      setErrStatus(false)
      setErrMsg("")
      await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputReq}&units=metric&appid=${api.key}`)
      .then((response) => response.json())
      .then(res=>{
        setRes(res)
        if(res.cod=='404'){
          setErrStatus(true)
          setErrMsg(res.message)      
          console.log(res);
        }
      })
      .catch(err=>{
        setErrStatus(true)
        setErrMsg(err)  
        setRes("")
        console.log(err);
      })
    }
    catch(err) {  
      setErrStatus(true)
      setErrMsg(err)   
      console.log("err");
    }
    finally {
      setLoad(false);
      setInput("")
      if(errStatus){
        setRes()
        console.log("err");
      }
    }
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./assets/bg.jpg')}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.text}>Weather App</Text>
        <View>
          <TextInput 
            style={styles.input} 
            placeholder='Enter Country name ...'
            placeholderTextColor="#777"
            onChangeText={text=>setInput(text)}
            value={input}
            onSubmitEditing={submitHandler}
          >
          </TextInput>
        </View>
        {load && <View>
            <ActivityIndicator size={'large'} color="#000"></ActivityIndicator>
          </View>}
          { !errStatus && res && <View style={styles.infoVal}>
              <Text style={styles.countryname}>
                {`${res?.name}, ${res?.sys?.country}`}
              </Text>
              <Text style={styles.dateTime}>{new Date().toLocaleString()}</Text>
              <Text style={styles.temp}>{`${Math.round(res?.main?.temp)} °C`}</Text>
              <Text style={styles.tempMaxMin}>{`${Math.round(res?.main?.temp_min)}°C / ${Math.round(res?.main?.temp_max)} °C`}</Text>
              {
                res.weather && <Text style={styles.desc}>{`${res?.weather[0]?.description}`} </Text>
              }
              <Text style={styles.extraParam}>{`Pressure: ${res?.main?.pressure}`}</Text>
              <Text style={styles.extraParam}>{`Wind speed: ${res?.wind?.speed}`}</Text>
            </View>}
          {errStatus && !res && <View style={styles.infoVal}>
              <Text style={styles.errMsg}>
                {`Error ${errMsg}`}
              </Text>
            </View>}
            <Text style={styles.devText}>Devoleped by Qobulov Asror</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  text: {
    fontSize: 35,
    color: "#fff",
    textAlign: 'center',
    marginTop: 65,
  },
  input: {
    color: "#000",
    padding: 10,
    fontSize: 30,
    margin: 20,
    marginTop: 20,
    // borderBottomColor: '#fff',
    borderBottomWidth: 2,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  infoVal:{
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#00000060",
    width: "90%",
    height: '60%',
  },
  countryname: {
    fontSize: 40,
    color: "#fff",
    textAlign: 'center'
  },
  dateTime: {
    textAlign: 'center',
    fontSize: 18,
    color: "#fff"
  },
  temp:{
    color: "#fff",
    fontSize: 70,
    textAlign: 'center'
  },
  tempMaxMin:{
    textAlign:'center',
    color: "#fff",
    fontSize: 30,
  },
  desc: {
    fontSize: 60,
    color: '#fff',
    textAlign: 'center'
  },
  extraParam: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 10
  },
  errMsg:{
    color: '#f00',
    fontSize: 30,
    textAlign: 'center',
  },
  devText:{
    color: "#000",
    textAlign: 'center',
    fontSize: 30,
    position: 'absolute',
    top: '90%',
    left: '3%'
  }
});
