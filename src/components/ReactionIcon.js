// @flow
import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import type { ReactionCounts } from 'getstream';
import { buildStylesheet } from '../styles';

import type { StylesProps } from '../types';

type Props = {|
  icon: string,
  counts?: ReactionCounts,
  kind?: string,
  height?: number,
  width?: number,
  onPress?: (kind: ?string) => any,
  ...StylesProps,
|};

export default function ReactionIcon(props: Props) {
  let count = null;
  if (props.counts && props.kind) {
    count = props.counts[props.kind];
  }
  let styles = buildStylesheet('reactionIcon', props.styles);

  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Image
        source={props.icon}
        style={[
          styles.image,
          {
            width: props.width,
            height: props.height,
          },
        ]}
      />
      {count != null ? <Text style={styles.text}>{count}</Text> : null}
    </TouchableOpacity>
  );
}
