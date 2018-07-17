import React from 'react';
import {
  ScrollView,
  StatusBar,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { activities } from '../../mock/data';

import Avatar from '../../components/Avatar';

import Activity from '../../components/Activity';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'HOME',
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13,
    },
    headerLeft: (
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={{ paddingLeft: 15 }}
      >
        <Avatar
          source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg"
          size={23}
          noShadow
        />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate('NewPost')}
        style={{ paddingRight: 15 }}
      >
        <Image
          source={require('../../images/icons/post.png')}
          style={{ width: 23, height: 23 }}
        />
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      data: activities,
      counter: 0,
      selected: '',
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  _onItemPress = (item) => {
    this.props.navigation.navigate('SinglePost', { item: item });
  };

  _onAvatarPress = (id) => {
    console.log('user id: ', id);
  };

  _renderItem = ({ item }) => {
    return (
      <Activity
        id={item.id}
        author={item.author}
        type={item.type}
        to={item.to}
        time={item.timestamp}
        content={item.content}
        image={item.image}
        link={item.link}
        object={item.object}
        onItemPress={() => this._onItemPress(item)}
        onAvatarPress={() => this._onAvatarPress(item.id)}
      />
    );
  };

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList
          data={this.state.data}
          keyExtractor={(item) => item.id}
          renderItem={this._renderItem}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({});

export default HomeScreen;
