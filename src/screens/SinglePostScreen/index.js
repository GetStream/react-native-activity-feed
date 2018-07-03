import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView}  from 'react-native';

import BackButton from '../../components/BackButton';
import Activity from '../../components/Activity';
import Avatar from '../../components/Avatar';

class SinglePostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "POST DETAIL",
    headerLeft: <BackButton pressed={() => navigation.goBack()} color="blue" />,
    headerStyle: {
      paddingLeft: 15,
      paddingRight: 15
    },
    headerTitleStyle: {
      fontWeight: "500",
      fontSize: 13
    },
    tabBarVisible: false
  });
  render() {
    const {navigation} = this.props;
    const item = navigation.getParam('item', 'no item found');
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
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
            static />
        </ScrollView>
        <View style={styles.replyContainer}>
          <Avatar source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg" size={48}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  scrollContainer: {
    flex: 1
  },
  replyContainer: {
    height: 78,
    shadowOffset: { width: 0, height: -3, },
    shadowColor: 'black',
    shadowOpacity: .1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  }
});

export default SinglePostScreen;