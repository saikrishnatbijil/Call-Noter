import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CallHistory = ({ callData, navigation }) => {
  const [visibleIndex, setVisibleIndex] = useState(-1);
  // Extract names and phone numbers from the callData array
  const namesAndPhoneNumbers = callData.map(call => ({
    name: call.name,
    phoneNumber: call.phoneNumber,
    time: call.timestamp,
  }));

  const toggleVisibility = (index) => {
    setVisibleIndex(index === visibleIndex ? -1 : index);
  };

  // Render item for FlatList
  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.logContainer} onPress={() =>  navigation.navigate('LogInfo', {item, navigation})}>
      <View style={styles.cellOne}>
      <View style={styles.nameGroup}>
        <Text style={styles.name}>{item.name == null ? item.phoneNumber : item.name}</Text>
        <Text>{item.name == null ? item.name : item.phoneNumber}</Text>
      </View>
      {/* Add Time in hh:mm format */}
      <Text>{new Date(parseInt(item.time)).getHours()}:{new Date(parseInt(item.time)).getMinutes()}</Text>
      </View>

      {index === visibleIndex && (
        <View style={styles.cellTwo}>
          <TouchableOpacity style={styles.btn}>
            <Text>Add Note</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <Text>Copy Number</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={namesAndPhoneNumbers}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      style={styles.list}
    />
  );
};


const styles = StyleSheet.create({
    name: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    logContainer: {
        padding: 15,
        backgroundColor: '#f2f2f2',
        marginBottom: 15,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: '#313131',
        borderWidth: 1,
    },
    cellOne:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    list: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    nameGroup: {
        
    },
    btn:{
        width: '100%',
        padding: 25,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderColor: '#313131',
        borderWidth: 1,
    },
  });

export default CallHistory;
