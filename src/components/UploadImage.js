// @flow
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import type { StyleSheetLike } from '../types';
import PickPhotoIcon from '../images/icons/pickphoto.png';
import { buildStylesheet } from '../styles';

type Props = {|
  onUploadButtonPress?: () => mixed,
  styles?: StyleSheetLike,
|};

const UploadImage = ({ onUploadButtonPress, ...props }: Props) => {
  const styles = buildStylesheet('uploadImage', props.styles || {});

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onUploadButtonPress}>
        <Image source={PickPhotoIcon} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
};

export default UploadImage;
