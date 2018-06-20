import React from 'react';
import { StatusBar, ScrollView, FlatList, SafeAreaView } from 'react-native'

import Notification from "../../components/Notification";
import Follows from '../../components/Follows';

export default class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [
        {
          id: '1'
        },
        {
          id: '2',
          type: 'follow',
          follows: [
            {
              user_id: 123,
              user_image: 'https://randomuser.me/api/portraits/women/44.jpg',
              user_name: 'Wonderwoman'
            },
            {
              user_id: 234,
              user_image: 'https://randomuser.me/api/portraits/women/43.jpg',
              user_name: 'Wonderwoman'
            }
          ]
        },
        {
          id: '3'
        }
      ]
    }
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

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({ item }) => {
    if (item.type === 'follow') {
      return <Follows items={item.follows} />;
    }
    return <Notification />;
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
