import React from 'react';
import { ScrollView, StatusBar, Image, StyleSheet, FlatList} from 'react-native';

import Avatar from '../../components/Avatar';

import Activity from '../../components/Activity';

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
      <Image source={require("../../images/icons/post.png")} style={{ width: 23, height: 23 }} />
    )
  });

  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          id: "1",
          author: {
            name: 'Fluff',
            handle: '@fluff',
            user_image: "https://mylittleamerica.com/988-large_default/durkee-marshmallow-fluff-strawberry.jpg"
          },
          type: 'reply',
          to: 'Fluff',
          content:"Great podcast with @getstream and @feeds! Thanks guys!",
          timestamp: '2mins'
        },
        {
          id: "2",
          author: {
            name: 'Justice League',
            handle: '@justiceleague',
            user_image: "http://www.comingsoon.net/assets/uploads/2018/01/justice_league_2017___diana_hq___v2_by_duck_of_satan-db3kq6k.jpg"
          },
          content: "Wonder Woman is going to be great!",
          timestamp: '4 mins',
          image: 'http://www.comingsoon.net/assets/uploads/2018/01/justice_league_2017___diana_hq___v2_by_duck_of_satan-db3kq6k.jpg'
        },
        {
          id: "3",
          author: {
            name: "David Bowie",
            handle: "@davidbowie",
            user_image: "http://www.officialcharts.com/media/649820/david-bowie-1100.jpg?"
          },
          content: "Great podcast with @getstream and @feeds! Thanks guys!",
          timestamp: '6 mins',
          link: true,
          object: {
            type: 'link',
            title: "Hello World",
            description: "This is ground control for mayor Tom"
          }
        },
      ],
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
