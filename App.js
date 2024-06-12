import { StyleSheet, Text, View, PermissionsAndroid, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import LogInfoScreen from './screens/LogInfo';
import ImageInfo from './screens/ImageInfo';
import ARecord from './screens/ARecord';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown:false}} name="Home" component={HomeScreen} />
        <Stack.Screen options={{headerShown:false}} name="LogInfo" component={LogInfoScreen} />
        <Stack.Screen options={{headerShown:false}} name="ImageInfo" component={ImageInfo} />
        <Stack.Screen options={{headerShown:false}} name="ARecord" component={ARecord} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

