// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ChildrenProps } from '~/types';

type Props = {
  ...ChildrenProps,
  style?: any,
};

export default function ReactionCounterBar(props: Props) {
  return (
    <View style={[styles.container, { ...props.style }]}>{props.children}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 100 + '%',
  },
});
