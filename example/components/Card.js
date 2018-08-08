import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Card = ({ item }) => {
  let { title, description, image } = item;

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={image ? { uri: image } : require('../images/placeholder.png')}
      />
      <View style={styles.content}>
        {
          //TODO: Only put ... when the title or description are too long
        }
        <Text style={styles.title}>
          {title.slice(0, 60)}
          ...
        </Text>
        <Text style={styles.description}>
          {description.slice(0, 60)}
          ...
        </Text>
      </View>
    </View>
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
