import React from 'react';
import { View, Text, ScrollView, StyleSheet}  from 'react-native';

import BackButton from '../../components/BackButton';
import Activity from '../../components/Activity';

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
      <ScrollView style={styles.container} >
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
})

export default SinglePostScreen;