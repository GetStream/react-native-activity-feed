// @flow
import React from 'react';
import ReactionIcon from './ReactionIcon';
import type { ReactionCounts, ReactionKindMap } from 'getstream';
import type { StylesProps } from '../types';

type Props = {|
  activeIcon: string,
  inactiveIcon: string,
  kind?: string,
  own_reactions: ?ReactionKindMap<{}, {}>,
  counts?: ReactionCounts,
  height?: number,
  width?: number,
  onPress?: (kind: ?string) => any,
  ...StylesProps,
|};

export default function ReactionToggleIcon({
  activeIcon,
  inactiveIcon,
  own_reactions,
  kind = 'like',
  ...props
}: Props) {
  let icon = inactiveIcon;
  if (own_reactions && own_reactions[kind] && own_reactions[kind].length) {
    icon = activeIcon;
  }
  return <ReactionIcon icon={icon} kind={kind} {...props} />;
}
