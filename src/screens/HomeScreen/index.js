import React from 'react';
import { View, ScrollView, StatusBar, Image, StyleSheet, FlatList} from 'react-native';

import { activities } from '../../mock/data';

import Avatar from '../../components/Avatar';

import Activity from '../../components/Activity';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "HOME",
    headerTitleStyle: {
      fontWeight: "500",
      fontSize: 13
    },
    headerLeft: (
      <View style={{paddingLeft: 15}}>
        <Avatar
          source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg"
          size={23}
          noShadow
        />
      </View>
    ),
    headerRight: (
      <View style={{paddingRight: 15}}><Image source={require("../../images/icons/post.png")} style={{ width: 23, height: 23 }} /></View>
    )
  });

  constructor(props) {
    super(props)
    this.state = {
      data: activities,
      counter: 0,
      selected: ''
    };

  }


  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("dark-content");
    });
  }

  _onItemPress = (item) => {
    this.props.navigation.navigate('SinglePost', {item: item})
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
      />
    );
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <FlatList
          data={this.state.data}
          keyExtractor={item => item.id}
          renderItem={this._renderItem}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

});





export default HomeScreen;
