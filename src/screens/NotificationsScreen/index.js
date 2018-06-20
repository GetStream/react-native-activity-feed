import React from 'react';
import { StatusBar, ScrollView, FlatList } from 'react-native'

import Notification from '../../components/Notification';

export default class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Notifications'.toUpperCase(),
    headerStyle: {
      paddingLeft: 10,
      paddingRight: 10,
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

  render() {
    return <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <FlatList
          data={[{ key: '1' }, { key: '2' }, { key: '3' },]}
          renderItem={({item}) => <Notification />}
        />
      </ScrollView>;
  }
}
