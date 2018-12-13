// @flow
import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import type { ReactionCounts } from 'getstream';
import { buildStylesheet } from '../styles';

import type { StyleSheetLike } from '../types';

type Props = {|
  /** The icon to display */
  icon: string | number,
  /** The reaction counts for the activity */
  counts?: ReactionCounts,
  /** The kind of reaction that this displays */
  kind: string,
  /** The height of the icon */
  height?: number,
  /** The width of the icon */
  width?: number,
  /** Function to call when pressed, usually this should call `props.onToggleReaction` */
  onPress?: (kind: string) => any,
  /** The label to display if the count is one (e.g "like") */
  labelSingle?: string,
  /** The label to display if the count is more than one (e.g "likes") */
  labelPlural?: string,
  /** Styling of the icon */
  styles?: StyleSheetLike,
|};

export default function ReactionIcon(props: Props) {
  let count = null;
  if (props.counts && props.kind) {
    count = props.counts[props.kind] || 0;
  }
  let styles = buildStylesheet('reactionIcon', props.styles);

  let dimensions = {};
  if (props.height !== undefined) {
    dimensions.height = props.height;
  }
  if (props.width !== undefined) {
    dimensions.width = props.width;
  }
  let label = count === 1 ? props.labelSingle : props.labelPlural;

  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Image source={props.icon} style={[styles.image, dimensions]} />
      {count != null ? (
        <Text style={styles.text}>
          {count}
          {label && ' ' + label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
