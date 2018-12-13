// @flow
import React from 'react';
import { buildStylesheet } from '../styles';
import ReactionToggleIcon from './ReactionToggleIcon';
import type {
  BaseActivityResponse,
  ToggleReactionCallbackFunction,
  StyleSheetLike,
} from '../types';

type Props = {|
  /** The activity received for stream for which to show the like buton. This is
   * used to initalize the toggle state and the counter. */
  activity: BaseActivityResponse,
  /** The function that toggles the reaction. */
  onToggleReaction: ToggleReactionCallbackFunction,
  /** Styling of the button */
  styles?: StyleSheetLike,
|};

/**
 * Like button ready to be embedded as Activity footer
 * @example ./examples/LikeButton.md
 */
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
