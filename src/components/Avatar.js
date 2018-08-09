// @flow
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import UploadImage from './UploadImage';
import { mergeStyles } from '../utils';

import type { StylesProps } from '../types';

type Props = {|
  source?: string,
  size?: number,
  editButton?: boolean,
  noShadow?: boolean,
  notRound?: boolean,

  onUploadButtonPress?: () => mixed,
  ...StylesProps,
|};

const Avatar = ({
  source,
  size = 200,
  noShadow,
  notRound,
  editButton,
  onUploadButtonPress,
  ...props
}: Props) => {
  let borderRadius = notRound ? undefined : size / 2;

  return (
    <View
      style={mergeStyles(
        'container',
        styles,
        props,
        noShadow ? styles.noShadow : null,
        {
          width: size,
          height: size,
        },
      )}
    >
      <Image
        style={mergeStyles('image', styles, props, {
          width: size,
          height: size,
          borderRadius: borderRadius,
        })}
        source={source ? { uri: source } : require('../images/placeholder.png')}
      />
      {editButton ? (
        <UploadImage onUploadButtonPress={onUploadButtonPress} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
  },
  noShadow: {
    shadowOpacity: 0,
  },
});

export default Avatar;
