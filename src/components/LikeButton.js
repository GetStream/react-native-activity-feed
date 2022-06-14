import * as React from 'react';
import PropTypes from 'prop-types';

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

LikeButton.propTypes = {
  /**
   * The activity received from Stream that should be liked when pressing the LikeButton.
   **/
  activity: PropTypes.object.isRequired,
  /**
   * The reaction received from Stream that should be liked when pressing the
   * LikeButton. Liking a reaction requires to pass both this field and
   * the `onToggleChildReaction` as well.
   */
  reaction: PropTypes.object,
  /** The reactionKind that is used to like, you can for instance set this to
   * `heart`. */
  reactionKind: PropTypes.string,
  /** The function that toggles reactions on activities. */
  onToggleReaction: PropTypes.func,
  /** The function that toggles reactions on reactions. */
  onToggleChildReaction: PropTypes.func,
  /** Styling of the button */
  styles: PropTypes.object,
};
