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

import UserBar from '../UserBar';
import ReactionCounterBar from '../ReactionCounterBar';
import ReactionCounter from '../ReactionCounter';
import Card from '../Card';
import type { ActivityData } from '~/types';

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
};

class Activity extends React.Component<Props> {
  _onPress = () => {
    if (this.props.onItemPress) {
      this.props.onItemPress();
    }
  };
  _onAvatarPress = () => {
    if (this.props.onAvatarPress) {
      this.props.onAvatarPress(this.props.activity.actor.id);
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
    if (verb === 'like') {
      icon = HeartIcon;
    }
    if (verb === 'repost') {
      icon = RepostIcon;
    }
    if (verb === 'reply') {
      icon = ReplyIcon;
      sub = `reply to ${actor.data.name || 'Unknown'}`;
    }

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
              // TODO: make this a nice time (e.g. 5m ago)
              time: time ? time : '',
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
              />
              <ReactionCounter
                value={reaction_counts.heart || 0}
                icon={
                  own_reactions && own_reactions.heart
                    ? HeartIcon
                    : HeartIconOutline
                }
              />
              <ReactionCounter
                value={reaction_counts.reply || 0}
                icon={ReplyIcon}
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
