import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

import Avatar from '../Avatar';

const UserBar = ({data}) => {
  const { handle, time, username, type } = data;

  const createSubline = () => {
    if ( !type && !handle ) {
      return;
    } else if (type === 'reply' || type === 'repost') {
      return (
        <View style={{flexDirection: 'row'}}>
          { type === 'reply' && <Text style={styles.handle}><Image source={require('../../images/icons/reply.png')} style={{ width: 24, height: 13,}}/> reply to {handle}</Text> }
          { type === 'repost' && <Text style={styles.handle}><Image source={require('../../images/icons/repost.png')} style={{ width: 24, height: 14, }} /> {handle}</Text> }
        </View>
      );
    } else {
      return <Text style={styles.handle}>{handle && handle}</Text>;
    }
  }

  return <View style={styles.container}>
      <Avatar source="https://randomuser.me/api/portraits/women/43.jpg" size={48} noShadow />
      <View style={styles.content}>
        <Text style={styles.username}>{username}</Text>
        {createSubline()}
      </View>
      { time && <View><Text style={styles.timestamp}>{time}</Text></View> }
    </View>;
}

const styles = StyleSheet.create({
  container: {
    width: 100 + "%",
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginLeft: 10,
    flex: 1
  },
  username: {
    fontSize: 17,
    fontWeight: '300',
    marginBottom: 4
  },
  handle: {
    fontSize: 15,
    opacity: 0.8,
    fontWeight: '300',
  },
  timestamp: {
    fontSize: 13,
    opacity: 0.8,
    fontWeight: '300'
  }
});

export default UserBar;
