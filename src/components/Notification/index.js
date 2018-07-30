import React from 'react';
import { View, StyleSheet } from 'react-native';
import AttachedObject from '../AttachedObject';
import UserBar from '../UserBar';

const Notification = ({ item }) => {
  let headerText, headerSubtext, icon;
  if (item.actors.length > 1) {
    headerText = `${item.actors[0].user_name} and ${item.actors.length -
      1} others `;
  } else {
    headerText = item.actors[0].user_name;
  }

  if (item.type === 'like') {
    headerSubtext = `liked your ${item.object.type}`;
    icon = require('../../images/icons/heart.png');
  }

  if (item.type === 'repost') {
    headerSubtext = `reposted your ${item.object.type}`;
    icon = require('../../images/icons/repost.png');
  }

  return (
    <View style={styles.item}>
      <UserBar
        data={{
          username: headerText,
          subtitle: headerSubtext,
          type: item.type,
          image: item.actors[0].user_image,
          icon: icon,
        }}
      />
      <View style={{ marginLeft: item.object.type !== 'link' ? 58 : 0 }}>
        <AttachedObject item={item.object} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#DADFE3',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'column',
  },
});

export default Notification;
