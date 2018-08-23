// @flow
import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import type { ReactionCounts } from 'getstream';
import { buildStylesheet } from '../styles';

import type { StylesProps } from '../types';

type Props = {|
  icon: string | number,
  counts?: ReactionCounts,
  kind?: string,
  height?: number,
  width?: number,
  onPress?: (kind: ?string) => any,
  labelSingle?: string,
  labelPlural?: string,
  ...StylesProps,
|};

export default function ReactionIcon(props: Props) {
  let count = null;
  if (props.counts && props.kind) {
    count = props.counts[props.kind];
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
