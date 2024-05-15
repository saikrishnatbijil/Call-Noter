import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, SafeAreaView, TouchableOpacity } from 'react-native';
import CallLogs from 'react-native-call-log'
import { CallHistory } from '../components'

const Home = ({ navigation }) => {
    const [logs, setLogs] = useState([]);
    const [loadLimit, setLoadLimit] = useState(20);
    const intervalRef = useRef();
  
    const loadCallLogs = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          {
            title: 'Call Log Example',
            message: 'Access your call logs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          CallLogs.load(loadLimit).then(c => {
            console.log(c)
            setLogs(c);
          });
        } else {
          console.log('Call Log permission denied');
        }
      }
      catch (e) {
        console.log(e);
      }
    };
  
    // Ask for permission and read call log
    useEffect(() => {
      intervalRef.current = setInterval(() => loadCallLogs(), 3000);

      return () => {
        clearInterval(intervalRef.current);
      };
      // loadCallLogs();
    }, []);
  
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headCon}>
            <Text style={styles.mainHead}>Your Call Logs</Text>
            <TouchableOpacity style={styles.btn} onPress={() => loadCallLogs()}>
                <Text>R</Text>
            </TouchableOpacity>
        </View>
        <CallHistory callData={logs} navigation={navigation} />
      </SafeAreaView>
    );
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
      },
      mainHead: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#313131',
      },
      headCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20
      },
      btn: {
        width: 40,
        height: 40,
        padding: 10,
        borderRadius: 5,
        borderColor: '#000000',
        borderWidth: 1,
        margin: 5,
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
})