import React from 'react';
import { ActionSheetIOS, View, Text, StatusBar, Image } from 'react-native'


class SearchScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'DISCOVER',
    headerStyle: {
      paddingLeft: 15,
      paddingRight: 15,
    },
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13
    },
    headerLeft: <Image source={require('../../images/icons/categories.png')} style={{ width: 23, height: 23 }} />,
    headerRight: <Image source={require('../../images/icons/post.png')} style={{ width: 23, height: 23 }} />,
  })

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>

      </View>
    );
  }
}

export default SearchScreen;
