import React from 'react';
import { ActionSheetIOS, View, Text, StatusBar} from 'react-native'


class HomeScreen extends React.Component {
  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  showActionSheet(navigation) {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Edit Profile'],
      cancelButtonIndex: 0,
    }, (buttonIndex) => {
      if (buttonIndex === 1) { navigation.navigate('EditProfile') }
    });
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text onPress={() => this.showActionSheet(this.props.navigation)}>Home !</Text>
      </View>
    );
  }
}

export default HomeScreen;
