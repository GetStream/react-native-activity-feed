// @flow
import React from 'react';
import { buildStylesheet } from '../styles';
import Button from './Button.js';
import type { ActivityData } from '../types';

type Props = {|
  activity: ActivityData,
  styles: any,
  onToggleReaction: any,
|};

export default class LikeButton extends React.Component<Props> {
  render() {
    let { activity, onToggleReaction } = this.props;
    let styles = buildStylesheet('likeButton', this.props.styles);

    return (
      <Button
        styles={styles}
        count={activity.reaction_counts.heart}
        on={
          activity.own_reactions.heart &&
          Boolean(activity.own_reactions.heart.length)
        }
        onPress={() => onToggleReaction('heart', activity)}
        icon={{
          on: require('../images/icons/heart.png'),
          off: require('../images/icons/heart-outline.png'),
        }}
        label={{
          single: 'like',
          plural: 'likes',
        }}
      />
    );
  }
}
