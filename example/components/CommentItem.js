// @flow
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// $FlowFixMe https://github.com/facebook/flow/issues/345
import HeartIconOutline from '../images/icons/heart-outline.png';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import ReplyIcon from '../images/icons/reply.png';

import { humanizeTimestamp } from '../utils';

import Avatar from './Avatar';
import type { Comment } from '../types';

type Props = {
  onPressLike?: (id: string) => any,
  onPressReply?: (id: string) => any,
  comment: Comment,
};

export default class CommentItem extends React.Component<Props> {
  _onPressReply = () => {
    if (this.props.onPressReply) {
      this.props.onPressReply(this.props.comment.id);
    }
  };
  _onPressLike = () => {
    if (this.props.onPressLike) {
      this.props.onPressLike(this.props.comment.id);
    }
  };

  render() {
    let { comment } = this.props;

    return (
      <View style={styles.commentItem}>
        <Avatar source={comment.user.data.profileImage} size={25} noShadow />
        <View style={styles.commentText}>
          <Text>
            <Text style={styles.commentAuthor}>{comment.user.data.name} </Text>
            <Text style={styles.commentContent}>{comment.data.text} </Text>
            <Text style={styles.commentTime}>
              {humanizeTimestamp(comment.created_at)}
            </Text>
          </Text>
        </View>
        <View style={styles.commentActions}>
          <TouchableOpacity onPress={this._onPressReply}>
            <Image source={ReplyIcon} style={styles.replyIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onPressLike}>
            <Image source={HeartIconOutline} style={styles.heartIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentItem: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 15,
    paddingLeft: 15,
    borderBottomColor: '#DADFE3',
    borderBottomWidth: 1,
  },
  commentText: {
    flex: 1,
    marginLeft: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  commentAuthor: {
    fontWeight: '700',
    fontSize: 14,
  },
  commentContent: {
    fontSize: 14,
  },
  commentTime: {
    fontSize: 14,
    color: '#95A4AD',
  },
  commentActions: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  replyIcon: { width: 24, height: 24 },
  heartIcon: { width: 24, height: 24 },
});
