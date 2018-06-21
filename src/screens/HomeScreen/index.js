import React from 'react';
import { View, StatusBar, Image, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { LinearGradient } from 'expo';


import Avatar from '../../components/Avatar';

import UserBar from "../../components/UserBar";
import PostControlBar from '../../components/PostControlBar'

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "HOME",
    headerStyle: {
      paddingLeft: 15,
      paddingRight: 15
    },
    headerTitleStyle: {
      fontWeight: "500",
      fontSize: 13
    },
    headerLeft: (
      <Avatar
        source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg"
        size={23}
        noShadow
      />
    ),
    headerRight: (
      <Image
        source={require("../../images/icons/post.png")}
        style={{ width: 23, height: 23 }}
      />
    )
  });

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("dark-content");
    });
  }

  render() {
  return <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: 10 }}>
      <UserBar data={{ handle: '@flow', time: '3 hours', username: 'Wonderwoman', type: 'reply' }} />
      <PostControlBar data={{ repost: 123, heart: 663, reply: 1}}/>
      <UserBar data={{ handle: '@flow', time: '3 hours', username: 'Wonderwoman', type: 'repost' }} />
      <PostControlBar data={{ repost: 0, heart: 0, reply: 0 }} />

      <UserBar data={{ time: '3 hours', username: 'Wonderwoman', handle: '@wonderwoman' }} />
      <PostControlBar data={{ repost: 33, heart: 12 }} />

      <UserBar data={{ time:'3 hours', username: 'Wonderwoman', }} />

      <TouchableOpacity>
        <LinearGradient colors={["#008DFF", "#0079FF"]} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>
            Follow
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>;
  }
}

const styles = StyleSheet.create({
  buttonGradient: {
    borderRadius: 6,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1
  },
  buttonText: { color: "white", fontSize: 10, fontWeight: "bold" }
});





export default HomeScreen;
