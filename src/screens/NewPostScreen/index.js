import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

class NewPostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "NEW POST",
    headerLeft:
      <TouchableOpacity
        style={{ paddingLeft: 15 }}
        onPress={() => navigation.goBack()}>
        <Image
          style={{width: 24, height: 24}}
          source={require('../../images/icons/close.png')} />
      </TouchableOpacity>,
    headerRight:
      <TouchableOpacity style={{ paddingRight: 15}}>
        <Text style={{ color: '#007AFF', fontSize: 17}}>Send</Text>
      </TouchableOpacity>,
    headerTitleStyle: {
      fontWeight: "500",
      fontSize: 13
    }
  });

  render() {
    return (
      <View style={styles.screenContainer}>
        <Text>NewPostScreen</Text>,
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'white'
  }
})

export default NewPostScreen;