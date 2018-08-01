// @flow
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { humanizeTimestamp } from '../utils';

import UserBar from './UserBar';
import ReactionCounterBar from './ReactionCounterBar';
import ReactionCounter from './ReactionCounter';
import CommentList from './CommentList';
import Card from './Card';
import type { ActivityData, UserResponse } from '../types';

// $FlowFixMe https://github.com/facebook/flow/issues/345
import HeartIcon from '../images/icons/heart.png';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import HeartIconOutline from '../images/icons/heart-outline.png';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import RepostIcon from '../images/icons/repost.png';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import ReplyIcon from '../images/icons/reply.png';

type Props = {
  activity: ActivityData,
  style?: any,
  onItemPress?: () => any,
  onAvatarPress?: (id: string) => any,
  onReactionCounterPress?: (kind: string, activity: ActivityData) => any,
};

class Activity extends React.Component<Props> {
  _onPress = () => {
    if (this.props.onItemPress) {
      this.props.onItemPress();
    }
  };
  _onAvatarPress = () => {
    if (this.props.onAvatarPress && this.props.activity.actor !== 'NotFound') {
      this.props.onAvatarPress(this.props.activity.actor.id);
    }
  };
  _onReactionCounterPress = (kind: string) => {
    if (this.props.onReactionCounterPress) {
      this.props.onReactionCounterPress(kind, this.props.activity);
    }
  };

  render() {
    const { width } = Dimensions.get('window');
    let icon, sub;
    let {
      time,
      actor,
      verb,
      object,
      content,
      image,
      reaction_counts,
      own_reactions,
      latest_reactions,
    } = this.props.activity;

    let notFound: UserResponse = {
      id: '!not-found',
      created_at: '',
      updated_at: '',
      data: {
        name: 'Unknown',
      },
    };

    if (actor === 'NotFound') {
      actor = notFound;
    }

    if (verb === 'heart') {
      icon = HeartIcon;
    }
    if (verb === 'repost') {
      icon = RepostIcon;
    }
    if (verb === 'comment') {
      icon = ReplyIcon;
      // TODO: This is wrong. Should take name from object.
      sub = `reply to ${actor.data.name || 'Unknown'}`;
    }

    return (
      <TouchableOpacity
        style={[{ ...this.props.style }, styles.container]}
        onPress={this._onPress}
        disabled={this.props.onItemPress === undefined}
      >
        <View style={{ padding: 15 }}>
          <UserBar
            onPressAvatar={this._onAvatarPress}
            data={{
              username: actor.data.name,
              image: actor.data.profileImage,
              subtitle: sub,
              time: humanizeTimestamp(time),
              icon: icon,
            }}
          />
        </View>
        <View style={{ paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}>
          <Text>{content}</Text>
        </View>

        {verb == 'repost' &&
          object instanceof Object && (
            <View style={{ paddingLeft: 15, paddingRight: 15 }}>
              <Card item={object.data} />
            </View>
          )}

        {image && (
          <Image
            style={{ width: width, height: width }}
            source={{ uri: image }}
          />
        )}

        {reaction_counts && (
          <View
            style={{ paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}
          >
            <ReactionCounterBar>
              <ReactionCounter
                value={reaction_counts.repost || 0}
                icon={{ source: RepostIcon, width: 24, height: 24 }}
                onPress={() => this._onReactionCounterPress('repost')}
              />
              <ReactionCounter
                value={reaction_counts.heart || 0}
                icon={
                  own_reactions &&
                  own_reactions.heart &&
                  own_reactions.heart.length
                    ? { source: HeartIcon, width: 24, height: 24 }
                    : { source: HeartIconOutline, width: 24, height: 24 }
                }
                onPress={() => this._onReactionCounterPress('heart')}
              />
              <ReactionCounter
                value={reaction_counts.comment || 0}
                icon={{ source: ReplyIcon, width: 24, height: 24 }}
                onPress={() => this._onReactionCounterPress('comment')}
              />
            </ReactionCounterBar>
          </View>
        )}
        {latest_reactions &&
        latest_reactions.comment &&
        latest_reactions.comment.length ? (
          <CommentList comments={latest_reactions.comment} />
        ) : (
          false
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
  },
});

export default Activity;
