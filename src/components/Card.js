import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { mergeStyles } from '../utils';

const Card = ({ item, ...props }) => {
  let { title, description, image, url } = item;

  return (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(url);
      }}
      style={mergeStyles('container', styles, props)}
    >
      <Image
        style={mergeStyles('image', styles, props)}
        source={image ? { uri: image } : require('../images/placeholder.png')}
      />
      <View style={mergeStyles('content', styles, props)}>
        {
          //TODO: Only put ... when the title or description are too long
        }
        <Text style={mergeStyles('title', styles, props)}>
          {title.slice(0, 60)}
          ...
        </Text>
        <Text style={mergeStyles('description', styles, props)}>
          {description.slice(0, 30)}
          ...
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#C5D9E6',
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  title: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 7,
  },
  description: {
    color: '#364047',
    fontSize: 13,
  },
});

export default Card;
