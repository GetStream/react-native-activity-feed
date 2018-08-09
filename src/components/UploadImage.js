// @flow
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { mergeStyles } from '../utils';
import type { StylesProps } from '../types';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import PickPhotoIcon from '../images/icons/pickphoto.png';

type Props = {|
  onUploadButtonPress?: () => mixed,
  ...StylesProps,
|};

const UploadImage = ({ onUploadButtonPress, ...props }: Props) => {
  return (
    <View style={mergeStyles('container', styles, props)}>
      <TouchableOpacity onPress={onUploadButtonPress}>
        <Image
          source={PickPhotoIcon}
          style={mergeStyles('image', styles, props)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 5,
    opacity: 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  image: {
    width: 35,
    height: 35,
  },
});

export default UploadImage;
