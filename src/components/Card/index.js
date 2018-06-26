import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Card = ({item}) => {
  let {title, description, image} = item;

  if (!image) {
    image = require('../../images/placeholder.png');
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={ image }/>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#C5D9E6",
    overflow: "hidden"
  },
  image: {
    width: 100,
    height: 100
  },
  content: {
    flex: 1,
    padding: 10
  },
  title: {
    color: "#007AFF",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 7
  },
  description: {
    color: "#364047",
    fontSize: 13
  }
});

export default Card;