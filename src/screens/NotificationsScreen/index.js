import React from 'react';
import { StatusBar, ScrollView, FlatList, SafeAreaView, Image } from 'react-native'

import Notification from "../../components/Notification";
import Follows from '../../components/Follows';

export default class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [
        {
          id: '1',
          type: 'like',
          object: {
            type: 'repost'
          }
        },
        {
          id: '2',
          type: 'follow',
          follows: [
            {
              user_id: 123,
              user_image: 'https://randomuser.me/api/portraits/women/44.jpg',
              user_name: 'Beyonce'
            },
            {
              user_id: 234,
              user_image: 'https://randomuser.me/api/portraits/women/43.jpg',
              user_name: 'Wonderwoman'
            }
          ]
        },
        {
          id: '3',
          type: 'like',
          object: {
            type: 'comment'
          }
        },
        {
          id: '4',
          type: 'like',
          object: {
            type: 'repost'
          }
        },
        {
          id: '5',
          type: 'like',
          object: {
            type: 'comment'
          }
        },
        {
          id: '6',
          type: 'like',
          object: {
            type: 'comment'
          }
        }
      ]
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'NOTIFICATIONS',
    headerLeft: <Image source={require('../../images/icons/categories.png')} style={{ width: 23, height: 23 }} />,
    headerRight: <Image source={require('../../images/icons/post.png')} style={{width:23, height: 23 }} />,
    headerStyle: {
      paddingLeft: 15,
      paddingRight: 15,
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
    return <Notification item={item} />;
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
