// @flow
import * as React from 'react';
import { buildStylesheet } from '../styles';
import ReactionToggleIcon from './ReactionToggleIcon';
import type {
  BaseActivityResponse,
  BaseReaction,
  ToggleReactionCallbackFunction,
  ToggleChildReactionCallbackFunction,
  StyleSheetLike,
} from '../types';

type Props = {|
  /** The activity received from Stream that should be liked when pressing the
   * LikeButton. */
  activity: BaseActivityResponse,
  /** The reaction received from Stream that should be liked when pressing the
   * LikeButton. Liking a reaction requires to pass both this field and
   * the `onToggleChildReaction` as well. */
  reaction?: BaseReaction,
  /** The reactionKind that is used to like, you can for instance set this to
   * `heart`. */
  reactionKind: string,
  /** The function that toggles reactions on activities. */
  onToggleReaction: ToggleReactionCallbackFunction,
  /** The function that toggles reactions on reactions. */
  onToggleChildReaction?: ToggleChildReactionCallbackFunction,
  /** Styling of the button */
  styles?: StyleSheetLike,
|};

/**
 * Like button ready to be embedded as Activity footer
 * @example ./examples/LikeButton.md
 */
export default class LikeButton extends React.Component<Props> {
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
    let { activity, reaction, reactionKind } = this.props;
    let styles = buildStylesheet('likeButton', this.props.styles);
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
        labelSingle="like"
        labelPlural="likes"
      />
    );
  }
}
