//
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import PickPhotoIcon from '../images/icons/pickphoto.png';
import { buildStylesheet } from '../styles';

const UploadImage = ({ onUploadButtonPress, ...props }) => {
  const styles = buildStylesheet('uploadImage', props.styles || {});

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onUploadButtonPress}>
        <Image source={PickPhotoIcon} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
};

UploadImage.propTypes = {
  onUploadButtonPress: PropTypes.func,
  styles: PropTypes.object,
};

export default UploadImage;
