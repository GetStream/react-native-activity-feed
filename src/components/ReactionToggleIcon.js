//
import React from 'react';
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
