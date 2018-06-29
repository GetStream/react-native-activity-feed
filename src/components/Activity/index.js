import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

import UserBar from "../UserBar";
import PostControlBar from "../PostControlBar";
import Card from '../Card';

const Activity = ({
    type,
    image,
    author,
    to,
    link,
    item,
    time, content
  }) => {
  const {height, width} = Dimensions.get('window');
  let icon, sub;
  if (type === "like") {
    icon = require("../../images/icons/heart.png");
  }
  if (type === "repost") {
    icon = require("../../images/icons/repost.png");
  }
  if (type === "reply") {
    icon = require("../../images/icons/reply.png");
    sub = `reply to ${to}`
  }

  return (
    <View style={styles.container}>
      <View style={{ padding: 15 }}>
        <UserBar
          data={{
              username: author.name,
              image: author.user_image,
              handle: sub,
              time: time ? time : '',
              icon: icon,

            }}/>
      </View>
      <View style={{ paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}>
        <Text>{content}</Text>
      </View>

      { link &&
      <View style={{paddingLeft: 15, paddingRight: 15}}>
        <Card item={item}/>
      </View>}

      { image &&
      <Image
        style={{width: width, height: width}}
        source={{ uri: image}} /> }

      <View style={{ paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}>
        <PostControlBar data={{
          repost: {
            'icon-outline': require('../../images/icons/repost.png'),
            'icon-filled': require('../../images/icons/repost.png'),
            value: 13,
            style: 'icon-outline'
          },
          heart: {
            'icon-outline': require('../../images/icons/heart-outline.png'),
            'icon-filled': require('../../images/icons/heart.png'),
            value: 22,
            style: 'icon-filled'
          },
          reply: {
            'icon-outline': require('../../images/icons/reply.png'),
            'icon-filled': require('../../images/icons/reply.png'),
            value: 3,
            style: 'icon-outline'
          }
        }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1
  }
});

export default Activity;
