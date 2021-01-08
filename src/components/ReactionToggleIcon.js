//
import React from 'react';
import PropTypes from 'prop-types';

import ReactionIcon from './ReactionIcon';

/**
 * A generic component that can be used to toggle a reaction and display it's
 * current state. Mostly used for reactions such as like and repost.
 * The [source for
 * LikeButton](https://github.com/GetStream/react-native-activity-feed/blob/master/src/components/LikeButton.js)
 * is a good example of the usage of this component.
 */
export default function ReactionToggleIcon({
  activeIcon,
  inactiveIcon,
  own_reactions,
  kind = 'like',
  ...props
}) {
  let icon = inactiveIcon;
  if (own_reactions && own_reactions[kind] && own_reactions[kind].length) {
    icon = activeIcon;
  }
  return <ReactionIcon icon={icon} kind={kind} {...props} />;
}

ReactionToggleIcon.propTypes = {
  /** The icon to show when the user has done this reaction (e.g. a filled in heart) */
  activeIcon: PropTypes.string,
  /** The icon to show when the user has not done this reaction yet (e.g. an empty in heart) */
  inactiveIcon: PropTypes.string,
  /** The kind of reaction that this toggles */
  kind: PropTypes.string,
  /** The height of the icon */
  height: PropTypes.number,
  /** The width of the icon */
  width: PropTypes.number,
  /** The map with own reactions */
  own_reactions: PropTypes.objectOf(PropTypes.array),
  /** The reaction counts for the activity */
  counts: PropTypes.objectOf(PropTypes.number),
  /**
   * Function to call when pressed, usually this should call `props.onToggleReaction`
   * @param {string} kind
   */
  onPress: PropTypes.func,
  /** The label to display if the count is one (e.g "like") */
  labelSingle: PropTypes.string,
  /** The label to display if the count is more than one (e.g "likes") */
  labelPlural: PropTypes.string,
  /** Styling of the icon */
  styles: PropTypes.object,
  /**
   * A function that returns either the string to display next to the icon or
   * null in case no string should be displayed. This can be used for
   * internationalization.
   *
   * e.g., (count, labelPlural, labelSingle) => "returning label string"
   * */
  labelFunction: PropTypes.func,
};
