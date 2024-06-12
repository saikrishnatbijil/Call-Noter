import { SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity, BackHandler, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Svg, Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraScreen } from '../components';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window')

const LogInfo = ({ route, navigation }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isClearButtonClicked, setClearButtonClicked] = useState(false);
  const [isCameraView, setIsCameraView] = useState(route.params.isCameraView)

  function useBackToHomeHandler(navigation) {
    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          navigation.navigate('Home');
          return true;
        };
  
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [navigation])
    );
  }

  useBackToHomeHandler(navigation);
  
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
    <ScrollView>
      <View style={styles.headCon}>
        <Text style={styles.mainHead}>Notes for {route.params.item.name == null ? route.params.item.phoneNumber : {name:route.params.item.name.length < 30 ? route.params.item.name : route.params.item.name}}</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearButtonClick}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.svgContainer} >
        {isCameraView ? <CameraScreen style={styles.cameraScreen} data={route.params.item} navigation={navigation}/> : 
        (
          <View onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
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
        )}
        
      </View>
      
      <View style={styles.funcCon}>
      <View style={styles.modeSwitchMenu}>
        <TouchableOpacity style={isCameraView ? null:[styles.menuChip,{backgroundColor: 'black'}]} onPress={() => setIsCameraView(false)}>
          <Text style={isCameraView ? styles.menuChip:[styles.menuText, {color: 'white'}]} >Writer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={isCameraView ? [styles.menuChip, {backgroundColor: 'black'}]:null} onPress={() => setIsCameraView(true)}>
          <Text style={isCameraView ? [styles.menuText, {color: 'white'}]:styles.menuChip}>Camera</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.menuChip, styles.modeSwitchMenu]} onPress={() => navigation.navigate("ARecord", {item:route.params.item})}>
        <Text style={{fontWeight: 'bold'}}>Record</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default LogInfo

const styles = StyleSheet.create({
  funcCon:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  mainHead: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#313131',
    paddingTop: 20,
  },
  headCon: {
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  svgContainer: {
    height: '70%',
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
  modeSwitchMenu: {
    width: '30%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
  },
  menuChip: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
})