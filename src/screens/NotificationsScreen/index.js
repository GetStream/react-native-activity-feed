import React from 'react';
import { StatusBar, ScrollView, FlatList, SafeAreaView, Image, View } from 'react-native'

import { notifications } from "../../mock/data";

import Notification from "../../components/Notification";
import Follow from '../../components/Notifications/Follow';

class NotificationScreen extends React.Component {
  state = {
    notifications: notifications
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'NOTIFICATIONS',
    headerLeft: <View style={{ paddingLeft: 15 }}><Image source={require('../../images/icons/categories.png')} style={{ width: 23, height: 23 }} /></View>,
    headerRight: <View style={{ paddingRight: 15 }}><Image source={require('../../images/icons/post.png')} style={{width:23, height: 23 }} /></View>,
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

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({ item }) => {
    if (item.type === 'follow') {
      return <Follow onPressAvatar={this._onPressAvatar} items={item.follows} />;
    } else {
      return <Notification item={item} />;
    }
  }

  _onPressAvatar(id) {
    console.log('hello ', id);
  }

  render() {
    return <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <SafeAreaView>
          <FlatList
            data={this.state.notifications}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
          />
        </SafeAreaView>
      </ScrollView>;
  }
}

export default NotificationScreen;
