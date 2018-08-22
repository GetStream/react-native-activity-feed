// @flow
import React from 'react';
import { View } from 'react-native';
import { buildStylesheet } from '../styles';
import type { ChildrenProps, StylesProps } from '../types';

type Props = {
  ...ChildrenProps,
  ...StylesProps,
};

export default function ReactionIconBar(props: Props) {
  let styles = buildStylesheet('reactionIconBar', props.styles);

  return <View style={styles.container}>{props.children}</View>;
}
