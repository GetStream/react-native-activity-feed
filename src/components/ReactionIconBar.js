// @flow
import * as React from 'react';
import { View } from 'react-native';
import { buildStylesheet } from '../styles';
import type { StyleSheetLike } from '../types';

type Props = {
  children?: React.Node,
  styles?: StyleSheetLike,
};

export default function ReactionIconBar(props: Props) {
  let styles = buildStylesheet('reactionIconBar', props.styles);

  return <View style={styles.container}>{props.children}</View>;
}
