import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { buildStylesheet } from '../styles';

import _ from 'lodash';

const Card = ({ item, ...props }) => {
  let { title, description, image, url } = item;
  let styles = buildStylesheet('card', props.styles);

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
      />
      <View style={styles.content}>
        {
          //TODO: Only put ... when the title or description are too long
        }
        <Text style={styles.title}>
          {_.truncate(title, {'length': 60})}
        </Text>
        <Text style={styles.description}>
          {_.truncate(description, { 'length': 60})}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
