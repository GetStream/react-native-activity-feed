// @flow
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';;
import type { StylesProps } from '../types';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import PickPhotoIcon from '../images/icons/pickphoto.png';
import { buildStylesheet } from '../styles';

type Props = {|
  onUploadButtonPress?: () => mixed,
  ...StylesProps,
|};

const UploadImage = ({ onUploadButtonPress, ...props }: Props) => {
  let styles = buildStylesheet('uploadImage', props.styles || {});

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onUploadButtonPress}>
        <Image
          source={PickPhotoIcon}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
};

export default UploadImage;
