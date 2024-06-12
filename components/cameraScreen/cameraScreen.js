import React, { useState, useEffect } from 'react';
import { Text, View, Button, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cameraScreen = ({ data, navigation, route }) => {
    const [camera, setCamera] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [imageList, setImageList] = useState([]);
    const [btndisabled, setBtnDisabled] = useState(false);

    const retrieveData = async () => {
        try {
          console.log("Getting data for key:", data.phoneNumber+1);
          const jsonValue = await AsyncStorage.getItem(data.phoneNumber+1);
          console.log("Retrieved data:", jsonValue);
          setImageList(jsonValue != null ? JSON.parse(jsonValue).reverse() : []);
          // return jsonValue != null ? jsonValue : null;
        } catch (e) {
          console.log("Error retrieving data:", e);
        }
      }

    useEffect(() => {
        retrieveData();
    }, [])

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

    const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value);
          console.log("Storing data:", toString(data.phoneNumber+1), jsonValue);
          await AsyncStorage.setItem(data.phoneNumber+1, jsonValue)
          .then(() => {
            retrieveData()
            setBtnDisabled(false)
          })
        } catch (e) {
          console.log("Error storing data:", e);
        }
      };
  
    const takePicture = async () => {
        setBtnDisabled(true)
        const photo = await camera.takePictureAsync();
        imageList.push(photo.uri)
        storeData(imageList);
        console.log(imageList);
    };

    const imageListItem = (item) => {
        console.log(item.item)
        return (
            <TouchableOpacity onPress={() => navigation.navigate("ImageInfo", {item, navigation, data, imageList})}>
                <Image source={{ uri: item.item }} style={styles.imageListItem} />
            </TouchableOpacity>
        )
    }


  return (
    <View>
        <CameraView ref={(ref) => setCamera(ref)} style={styles.camera} facing={'back'}>
        <View style={styles.subCon}>
        {/* <View><Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} /></View> */}
        <FlatList data={imageList.reverse()} renderItem={imageListItem} horizontal={true} />
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity disabled={btndisabled} style={styles.button} onPress={retrieveData}>
            <Text style={styles.text}>Load Shots</Text>
          </TouchableOpacity> */}
          <TouchableOpacity disabled={btndisabled} style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Shot</Text>
          </TouchableOpacity>
        </View>
        </View>
      </CameraView>
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
        marginTop: 20,
    },
    camera: {
        width: '100%',
        minHeight: '80%',
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    button: {
        backgroundColor: 'white',
        width: '100%',
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
    subCon: {
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    imageListItem: {
      width: 100,
      height: 100,
      borderRadius: 10,
      margin: 10,
    },
})