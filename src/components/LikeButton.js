// @flow
import React from 'react';
import { buildStylesheet } from '../styles';
import ReactionToggleIcon from './ReactionToggleIcon';
import type {
  BaseActivityResponse,
  ToggleReactionCallbackFunction,
} from '../types';

type Props = {|
  activity: BaseActivityResponse,
  onToggleReaction: ToggleReactionCallbackFunction,
  styles: any,
|};

export default class LikeButton extends React.Component<Props> {
  render() {
    let { activity, onToggleReaction } = this.props;
    let styles = buildStylesheet('likeButton', this.props.styles);

    return (
      <ReactionToggleIcon
        styles={styles}
        counts={activity.reaction_counts}
        own_reactions={activity.own_reactions}
        kind="like"
        onPress={() => onToggleReaction('like', activity, {})}
        activeIcon={require('../images/icons/heart.png')}
        inactiveIcon={require('../images/icons/heart-outline.png')}
        labelSingle="like"
        labelPlural="likes"
      />
    );
  }
}
