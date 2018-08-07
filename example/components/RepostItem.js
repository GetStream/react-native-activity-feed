import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import Avatar from './Avatar';

const RepostItem = ({ onPressLike, item }) => {
  return (
    <View style={styles.repostItem}>
      <View style={styles.repostAvatar}>
        <Avatar source={item.author.avatar} size={25} noShadow />
      </View>
      <Image
        source={require('../images/icons/repost.png')}
        style={styles.repostIcon}
      />
      <View style={styles.repostText}>
        <Text>
          <Text style={styles.repostAuthor}>{item.author.name} </Text>
          <Text style={styles.repostContent}>{item.content} </Text>
          <Text style={styles.repostTime}>{item.timestamp}</Text>
        </Text>
      </View>
      <View style={styles.repostActions}>
        <TouchableOpacity onPress={() => onPressLike(item.id)}>
          <Image
            source={require('../images/icons/heart-outline.png')}
            style={styles.heartIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  repostItem: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 12,
    paddingTop: 12,
    alignItems: 'center',
    borderBottomColor: '#DADFE3',
    borderBottomWidth: 1,
  },
  repostAvatar: {
    marginRight: 5,
  },
  repostIcon: {
    width: 20,
    height: 20,
  },
  heartIcon: { width: 24, height: 24 },
  repostText: {
    flex: 1,
    marginLeft: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  repostAuthor: {
    fontWeight: '700',
    fontSize: 14,
  },
  repostContent: {
    fontSize: 14,
  },
  repostTime: {
    fontSize: 14,
    color: '#95A4AD',
  },
  repostActions: {
    flexDirection: 'row',
    marginLeft: 5,
  },
});

export default RepostItem;
