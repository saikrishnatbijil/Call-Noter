import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';


const ImageInfo = ({ route, navigation }) => {
  const item = route.params.data;

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      console.log("Storing data:", toString(route.params.data.phoneNumber+1), jsonValue);
      await AsyncStorage.setItem(route.params.data.phoneNumber+1, jsonValue)
      .then(() => {
        // retrieveData()
        // setBtnDisabled(false)
        navigation.push('LogInfo', {item, isCameraView:true})
        console.log('donneeeee!!!!!')
      })
    } catch (e) {
      console.log("Error storing data:", e);
    }
  };

  const shareImage = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert('Sharing is not available on this platform');
      return;
    }

    try {
      await Sharing.shareAsync(route.params.item.item);
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  function deleteImage() {
    console.log('deleting a photo from number ::: ',route.params.data.phoneNumber)
    // remove route.params.item.item from route.params.imageList
    imageList = route.params.imageList.filter(value => value !== route.params.item.item);
    storeData(imageList);
  }
  return (
    <View>
      <Image style={styles.image} source={{ uri : route.params.item.item }}/>
      <View style={styles.btnCon}>
        <TouchableOpacity style={styles.btn} onPress={deleteImage}>
            <Text>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={shareImage}>
            <Text>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ImageInfo

const styles = StyleSheet.create({
    image:{
        width: '100%',
        height: '85%',
        alignSelf: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'black',
    },
    btn: {
        width: '49%',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderEndColor: 'black',
        borderWidth: 1,
        backgroundColor: 'white',
    },
    btnCon: {
        width: '80%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        borderRadius: 10,
    }
})