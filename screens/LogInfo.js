import { SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Svg, Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraScreen } from '../components';

const { width, height } = Dimensions.get('window')

const LogInfo = ({ route }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isClearButtonClicked, setClearButtonClicked] = useState(false);
  const [isCameraView, setIsCameraView] = useState(true)

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      console.log("Storing data:", toString(route.params.item.phoneNumber), jsonValue);
      await AsyncStorage.setItem(route.params.item.phoneNumber, jsonValue);
    } catch (e) {
      console.log("Error storing data:", e);
    }
  };

  useEffect( () => {
    const retrieveData = async () => {
      try {
        console.log("Getting data for key:", route.params.item.phoneNumber);
        const jsonValue = await AsyncStorage.getItem(route.params.item.phoneNumber);
        console.log("Retrieved data:", jsonValue);
        setPaths(jsonValue != null ? JSON.parse(jsonValue) : []);
        // return jsonValue != null ? jsonValue : null;
      } catch (e) {
        console.log("Error retrieving data:", e);
      }
    }
    retrieveData();
   }, [])

  const onTouchEnd = () => {
    paths.push(currentPath);
    setCurrentPath([]);
    setClearButtonClicked(false);
    storeData(paths)
  };

  const onTouchMove = (event) => {
    const newPath = [...currentPath];
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(0)},${locationY.toFixed(0)} `;
    newPath.push(newPoint);
    setCurrentPath(newPath);
  };

  const handleClearButtonClick = () => {
    console.log(paths)
    setPaths([]);
    setCurrentPath([]);
    setClearButtonClicked(true);
    storeData([])
  };

  return (
    <SafeAreaView>
      <View style={styles.headCon}>
        <Text style={styles.mainHead}>Notes for {route.params.item.name == null ? route.params.item.phoneNumber : route.params.item.name}</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearButtonClick}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {isCameraView ? <CameraScreen style={styles.cameraScreen} data={route.params.item}/> : null}
        <Svg height={height * 0.7} width={width}>
          <Path
            d={paths.join('')}
            stroke={isClearButtonClicked ? 'transparent' : 'red'}
            fill={'transparent'}
            strokeWidth={3}
            strokeLinejoin={'round'}
            strokeLinecap={'round'}
          />
          {paths.length > 0 &&
            paths.map((item, index) => (
              <Path
                key={`path-${index}`}
                d={currentPath.join('')}
                stroke={isClearButtonClicked ? 'transparent' : 'red'}
                fill={'transparent'}
                strokeWidth={2}
                strokeLinejoin={'round'}
                strokeLinecap={'round'}
              />
            ))}
        </Svg>
      </View>
    </SafeAreaView>
  )
}

export default LogInfo

const styles = StyleSheet.create({
  mainHead: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#313131',
    paddingTop: 20,
  },
  headCon: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  svgContainer: {
    height: '80%',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    overflow: 'hidden',
  },
  clearButton: {
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  clearButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
})