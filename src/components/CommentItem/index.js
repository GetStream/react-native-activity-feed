import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import Avatar from '../Avatar';

const CommentItem = ({onPressLike, onPressReply, item}) => {
  return (
    <View style={styles.commentItem}>
      <Avatar source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg" size={25} noShadow />
      <View style={styles.commentText}>
        <Text>
          <Text style={styles.commentAuthor}>TheBat </Text>
          <Text style={styles.commentContent}>I am glad people are finally starting to see this! </Text>
          <Text style={styles.commentTime}>2 mins</Text>
        </Text>
      </View>
      <View style={styles.commentActions}>
        <TouchableOpacity onPress={() => onPressReply(item.id)}>
          <Image
            source={require('../../images/icons/reply.png')}
            style={styles.replyIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressLike(item.id)}>
          <Image
            source={require('../../images/icons/heart-outline.png')}
            style={styles.heartIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentItem: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 15,
    paddingLeft: 15,
    borderBottomColor: "#DADFE3",
    borderBottomWidth: 1
  },
  commentText: {
    flex: 1,
    marginLeft: 5,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  commentAuthor: {
    fontWeight: "700",
    fontSize: 14
  },
  commentContent: {
    fontSize: 14
  },
  commentTime: {
    fontSize: 14,
    color: "#95A4AD"
  },
  commentActions: {
    flexDirection: "row",
    marginLeft: 5
  },
  replyIcon: { width: 24, height: 24 },
  heartIcon: { width: 24, height: 24 }
});

export default CommentItem;