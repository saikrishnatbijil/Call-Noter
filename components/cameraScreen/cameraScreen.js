import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cameraScreen = ({ data }) => {
    const [camera, setCamera] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }
  
    if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>We need your permission to show the camera</Text>
          <TouchableOpacity style={styles.btn} onPress={requestPermission}>
            <Text style={{ textAlign: 'center' }}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const retrieveData = async () => {
        try {
          console.log("Getting data for key:", data.phoneNumber+1);
          const jsonValue = await AsyncStorage.getItem(data.phoneNumber+1);
          console.log("Retrieved data:", jsonValue);
          setImageUri(jsonValue != null ? JSON.parse(jsonValue) : []);
          // return jsonValue != null ? jsonValue : null;
        } catch (e) {
          console.log("Error retrieving data:", e);
        }
      }

    const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value);
          console.log("Storing data:", toString(data.phoneNumber+1), jsonValue);
          await AsyncStorage.setItem(data.phoneNumber+1, jsonValue);
        } catch (e) {
          console.log("Error storing data:", e);
        }
      };
  
    const takePicture = async () => {
        const photo = await camera.takePictureAsync();
        setImageUri(photo.uri);
        storeData(photo.uri);
    };

  return (
    <View>
        <CameraView ref={(ref) => setCamera(ref)} style={styles.camera} facing={'back'}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={retrieveData}>
            <Text style={styles.text}>Load Shots</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Shot</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
    </View>
  )
}

export default cameraScreen

const styles = StyleSheet.create({
    btn:{
        backgroundColor: 'white',
        width: '90%',
        color: 'black',
        borderWidth: 1,
        borderColor: 'black',
        padding: 15,
        borderRadius: 5,
    },
    container: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderColor: 'black',
        borderRadius: 10,
        borderWidth: 1,
        padding: 20,
        alignSelf: 'center',
    },
    camera: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },
    buttonContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,

    },
    button: {
        height: '10%',
        backgroundColor: 'white',
        width: '45%',
        color: 'black',
        borderWidth: 1,
        borderColor: 'black',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'black',
        fontWeight: 'bold',
    },
})