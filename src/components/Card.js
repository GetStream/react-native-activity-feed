//@flow
import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { buildStylesheet } from '../styles';
import type { StyleSheetLike } from '../types';

import _ from 'lodash';

export type Props = {|
  title: ?string,
  description: ?string,
  image?: ?string,
  url?: ?string,
  styles?: StyleSheetLike,
  pressed?: () => mixed,
|};

/**
 * Card element
 * @example ./examples/Card.md
 */
const Card = (props: Props): any => {
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
        resizeMethod="resize"
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

export default Card;
