import { Button, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Audio } from 'expo-av'
import AsyncStorage from '@react-native-async-storage/async-storage';


const ARecord = ({ route }) => {
    const [recording, setRecording] = useState()
    const [recordings, setRecordings] = useState([])
    const [sound, setSound] = useState(null);

    const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value);
          console.log("Storing data:", toString(route.params.item.phoneNumber+1), jsonValue);
          await AsyncStorage.setItem(route.params.item.phoneNumber+2, jsonValue)
          .then(() => {
            // retrieveData()
            // setBtnDisabled(false)
            console.log('donneeeee!!!!!')
          })
        } catch (e) {
          console.log("Error storing data:", e);
        }
      };

    async function startRecording() {
        try {
            perm = await Audio.requestPermissionsAsync();
            if (perm.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESETS_HIGH_QUALITY)
                setRecording(recording)
            }
        } catch (e) {
            console.error('Failed to start recording', e);
        }
    }

    async function stopRecording() {
        setRecording(undefined)

        await recording.stopAndUnloadAsync()
        let allRecordings = [...recordings]
        const { sound, status } = await recording.createNewLoadedSoundAsync()
        allRecordings.push({
            sound: sound,
            duration: getDurationFormatter(status.durationMillis),
            file: recording.getURI(),
            playing: false,
        })
        
        setRecordings(allRecordings);
        storeData(allRecordings)
    }

    useEffect( () => {
        const retrieveData = async () => {
          try {
            console.log("Getting data for key:", route.params.item.phoneNumber+2);
            const jsonValue = await AsyncStorage.getItem(route.params.item.phoneNumber+2);
            console.log("Retrieved data:", JSON.parse(jsonValue));
            setRecordings(jsonValue != null ? JSON.parse(jsonValue) : [])
            // return jsonValue != null ? jsonValue : null;
          } catch (e) {
            console.log("Error retrieving data:", e);
          }
        }
        retrieveData();
       }, [])


    function getDurationFormatter(millis) {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    async function stopPlay(recordingLine) {
        updateRecordings(recordingLine.sound, recordingLine.duration, recordingLine.file, false)
        
        if (sound) {
            try {
              await sound.stopAsync();
            } catch (error) {
              console.error('Error stopping sound:', error);
            }
          }
    }

    async function startPlay(recordingLine) {
        updateRecordings(recordingLine.sound, recordingLine.duration, recordingLine.file, true)
        try {
            const { sound } = await Audio.Sound.createAsync({ uri: recordingLine.file });
            setSound(sound);
            await sound.playAsync();
          } catch (error) {
            console.error('Error playing sound:', error);
          }
    }

    function updateRecordings(sound, duration, file, playing) {
        let allRecordings = [...recordings];
        // Find the index of the recording to update
        const index = allRecordings.findIndex(recording => recording.sound === sound);
        
        // If the recording exists, update its information
        if (index !== -1) {
            allRecordings[index] = {
                ...allRecordings[index],
                // duration: duration !== undefined ? duration : allRecordings[index].duration,
                // file: file !== undefined ? file : allRecordings[index].file,
                playing: playing !== undefined ? playing : allRecordings[index].playing,
            };
            setRecordings(allRecordings);
            return sound
        } else {
            console.log("Recording not found."); // or handle accordingly
        }
    }
    
    function getRecordingLines() {
    
        return recordings.map((recordingLine, index) => {        
            return (
                <View key={index} style={styles.row}>
                    <Text style={styles.fill}>Recording #{index+1} | {recordingLine.duration}</Text>
                    <TouchableOpacity style={styles.playBtn} onPress={() => {recordingLine.playing ? stopPlay(recordingLine) : startPlay(recordingLine)}} >
                        <Text style={styles.playText}>{recordingLine.playing ? 'Stop' : 'Play'}</Text>
                    </TouchableOpacity>
                </View>
            )
        })
    }

    function clearRecordings() {
        setRecordings([])
        storeData([])
    }

  return (
    <SafeAreaView style={styles.container}>
    {/* <ScrollView  style={styles.ScrollView}> */}
        <TouchableOpacity 
        style={recording ? styles.recordBtn : [styles.recordBtn, {backgroundColor: 'white', borderWidth: 1}]} 
        onPress={recording ? stopRecording : startRecording}>
        <Text style={recording ? styles.recordStatusText : [styles.recordStatusText, {color: 'black'}]}>{recording ? 'Stop Recording .' : 'Start .'}</Text>
      </TouchableOpacity>
      <ScrollView>
      {getRecordingLines()}
      {recordings.length > 0 ? <TouchableOpacity style={styles.clearBtn} onPress={clearRecordings}>
        <Text style={styles.clearText}>Clear</Text>
      </TouchableOpacity> : null}
      </ScrollView>
    {/* </ScrollView> */}
    </SafeAreaView>
  )
}

export default ARecord

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    recordBtn: {
        width: '90%',
        height: '40%',
        alignSelf: 'center',
        backgroundColor: 'red',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    recordStatusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        fontSize: 30,
    },
    clearBtn: {
        width: '30%',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 1,
        padding: 10,
        borderColor: 'black',
        marginTop: 25,
        backgroundColor: 'red',
        marginBottom: 30,
    },
    clearText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    row: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    playBtn: {
        backgroundColor: 'black',
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    playText: {
        color: 'white',
    },
})