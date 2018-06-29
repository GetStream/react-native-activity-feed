import React from 'react';
import { ScrollView, StatusBar, Image, StyleSheet, RefreshControl} from 'react-native';

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
  return (
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>

        <Activity
          author={{
            name: 'Fluff',
            handle: '@fluff',
            user_image: 'https://mylittleamerica.com/988-large_default/durkee-marshmallow-fluff-strawberry.jpg'
          }}
          type={'reply'}
          to={'fluff'}
          time={'2 mins'}
          content="Great podcast with @getstream and @feeds! Thanks guys!"
          />

        <Activity
          author={{
            name: 'Justice League',
            handle: '@justiceleague',
            user_image: 'http://www.comingsoon.net/assets/uploads/2018/01/justice_league_2017___diana_hq___v2_by_duck_of_satan-db3kq6k.jpg'
          }}
          time={'3 mins'}
          content="Wonder Woman is going to be great!"
          image="http://www.comingsoon.net/assets/uploads/2018/01/justice_league_2017___diana_hq___v2_by_duck_of_satan-db3kq6k.jpg"/>

        <Activity
          author={{
            name: 'David Bowie',
            handle: '@davidbowie',
            user_image: 'http://www.officialcharts.com/media/649820/david-bowie-1100.jpg?'
          }}
          content="Great podcast with @getstream and @feeds! Thanks guys!"
          time={'3 mins'}
          link={true}
          item={{title: 'Hello World', description: 'This is ground control for mayor Tom'}} />

        <Activity
          author={{
            name: 'Lou Reed',
            handle: '@loureed',
            user_image: 'https://static.spin.com/files/131027-lou-reed-6-640x426.jpg'
          }}
          content="Great podcast with @getstream and @feeds! Thanks guys!"
          />


      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

});





export default HomeScreen;
