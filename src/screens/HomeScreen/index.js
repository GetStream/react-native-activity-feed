import React from 'react';
import { View, StatusBar, Image} from 'react-native';

import Avatar from '../../components/Avatar';

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
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }
}

export default HomeScreen;
