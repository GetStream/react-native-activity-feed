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
import moment from 'moment';

import UserBar from '../UserBar';
import ReactionCounterBar from '../ReactionCounterBar';
import ReactionCounter from '../ReactionCounter';
import Card from '../Card';
import type { ActivityData, UserResponse } from '~/types';

// $FlowFixMe https://github.com/facebook/flow/issues/345
import HeartIcon from '../../images/icons/heart.png';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import HeartIconOutline from '../../images/icons/heart-outline.png';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import RepostIcon from '../../images/icons/repost.png';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import ReplyIcon from '../../images/icons/reply.png';

type Props = {
  activity: ActivityData,
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
    if (verb === 'reply') {
      icon = ReplyIcon;
      // TODO: This is wrong. Should take name from object.
      sub = `reply to ${actor.data.name || 'Unknown'}`;
    }

    time = moment.utc(time); // parse time as UTC
    let now = moment();
    // Not in future humanized time
    let humanTime = moment.min(time, now).from(now);

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this._onPress}
        disabled={this.props.onItemPress === undefined}
      >
        <View style={{ padding: 15 }}>
          <UserBar
            onPressAvatar={this._onAvatarPress}
            data={{
              username: actor.data.name,
              image: actor.data.profileImage,
              handle: sub,
              time: humanTime,
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
                icon={RepostIcon}
                onPress={() => this._onReactionCounterPress('repost')}
              />
              <ReactionCounter
                value={reaction_counts.heart || 0}
                icon={
                  own_reactions &&
                  own_reactions.heart &&
                  own_reactions.heart.length
                    ? HeartIcon
                    : HeartIconOutline
                }
                onPress={() => this._onReactionCounterPress('heart')}
              />
              <ReactionCounter
                value={reaction_counts.reply || 0}
                icon={ReplyIcon}
                onPress={() => this._onReactionCounterPress('reply')}
              />
            </ReactionCounterBar>
          </View>
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
