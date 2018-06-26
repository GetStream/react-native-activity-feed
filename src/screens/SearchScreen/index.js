import React from 'react';
import { View, Text, StatusBar, Image, StyleSheet, ScrollView, TextInput } from 'react-native'

import LargeHeading from "../../components/LargeHeading";
import HorizontalScrollFeed from '../../components/HorizontalScrollFeed';
import Avatar from '../../components/Avatar';

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
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>

        <LargeHeading>Trending Groups</LargeHeading>
        <HorizontalScrollFeed
          data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 },]}
          renderItem={({ item }) => <View style={styles.block} key={item.id}></View>}
          keyExtractor={(item) => `item-${item.id}`} />

        <LargeHeading>Interesting Users</LargeHeading>
        <HorizontalScrollFeed
          data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 },]}
          renderItem={({ item }) => <View style={{marginRight: 6}}><Avatar size={60} noShadow source={'https://placehold.it/200x200'} /></View>}
          keyExtractor={(item) => `item-${item.id}`} />

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  searchbox: {
    backgroundColor: "rgba(0,0,0,0.1)",
    height: 28,
    borderRadius: 4,
    margin: 15
  },
  header: {
    color: "#535B61",
    fontSize: 18,
    fontWeight: "300"
  },
  innerScroll: {
    padding: 15,
    flexDirection: "row"
  },
  block: {
    width: 110,
    height: 110,
    borderRadius: 6,
    backgroundColor: "#ccc",
    marginRight: 6
  },
  circle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#cccccc",
    marginRight: 6
  }
});

export default SearchScreen;
