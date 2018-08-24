//@flow
import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { buildStylesheet } from '../styles';
import type { StyleSheetLike } from '../types';

import _ from 'lodash';

export type Item = {|
  title: ?string,
  description: ?string,
  image?: ?string,
  url?: ?string,
|};

export type Props = {|
  item: Item,
  styles?: StyleSheetLike,
  blue?: boolean,
  pressed?: () => void,
|};

/**
 * Card element
 * @example ./examples/Card.md
 */
const Card = (props: Props): any => {
  let { title, description, image, url } = props.item;
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
        <Text style={styles.title}>{_.truncate(title, { length: 60 })}</Text>
        <Text style={styles.description}>
          {_.truncate(description, { length: 60 })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
