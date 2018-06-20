import React from 'react';
import { StatusBar, View, ListView } from 'react-native'

export default class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Notifications'.toUpperCase(),
    headerStyle: {
      paddingLeft: 10,
      paddingRight: 10,
    },
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13
    }
  });

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  render() {
    return (
      <View></View>
    );
  }
}

