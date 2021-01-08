//
import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import PropTypes from 'prop-types';

import { buildStylesheet } from '../styles';

import _ from 'lodash';

/**
 * Card element
 * @example ./examples/Card.md
 */
const Card = (props) => {
  const { title, description, image, url } = props;
  const styles = buildStylesheet('card', props.styles);

  return (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(url);
      }}
      style={styles.container}
    >
      <Image
        style={styles.image}
        source={image ? { uri: image } : require('../images/placeholder.png')}
        resizeMethod='resize'
      />
      <View style={styles.content}>
        <Text style={styles.title}>{_.truncate(title, { length: 60 })}</Text>
        <Text style={styles.description}>
          {_.truncate(description, { length: 60 })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  styles: PropTypes.object,
  pressed: PropTypes.func,
};

export default Card;
