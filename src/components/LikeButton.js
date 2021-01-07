//
import * as React from 'react';
import { buildStylesheet } from '../styles';
import ReactionToggleIcon from './ReactionToggleIcon';

/**
 * Like button ready to be embedded as Activity footer
 * @example ./examples/LikeButton.md
 */
export default class LikeButton extends React.Component {
  static defaultProps = {
    reactionKind: 'like',
  };
  _onPress = () => {
    const {
      activity,
      reaction,
      reactionKind,
      onToggleReaction,
      onToggleChildReaction,
    } = this.props;

    if (reaction && onToggleChildReaction) {
      return onToggleChildReaction(reactionKind, reaction, {}, {});
    }
    return onToggleReaction(reactionKind, activity, {}, {});
  };

  render() {
    const { activity, reaction, reactionKind } = this.props;
    const styles = buildStylesheet('likeButton', this.props.styles);
    let counts, own_reactions;
    if (reaction && this.props.onToggleChildReaction) {
      counts = reaction.children_counts;
      own_reactions = reaction.own_children;
    } else {
      counts = activity.reaction_counts;
      own_reactions = activity.own_reactions;
    }

    return (
      <ReactionToggleIcon
        styles={styles}
        counts={counts}
        own_reactions={own_reactions}
        kind={reactionKind}
        onPress={this._onPress}
        activeIcon={require('../images/icons/heart.png')}
        inactiveIcon={require('../images/icons/heart-outline.png')}
      />
    );
  }
}
