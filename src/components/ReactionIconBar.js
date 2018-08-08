// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mergeStyles } from '../utils';
import type { ChildrenProps, StylesProps } from '../types';

type Props = {
  ...ChildrenProps,
  ...StylesProps,
};

export default function ReactionIconBar(props: Props) {
  return (
    <View style={mergeStyles('container', styles, props)}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 100 + '%',
  },
});
