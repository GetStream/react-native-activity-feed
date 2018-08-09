import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Card } from 'react-native-activity-feed';

const AttachedObject = ({ item }) => {
  if (item.type === 'repost') {
    return (
      <View style={styles.attachedObject}>
        <Text style={styles.attachedObjectText}>{item.content}</Text>
        <View style={styles.attachedObjectFooter}>
          <Text style={styles.attachedObjectFooterAuthor}>{item.author}</Text>
          <Text style={styles.attachedObjectFooterTimestamp}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  }

  if (item.type === 'post') {
    return (
      <View style={styles.attachedObject}>
        <Text style={styles.attachedObjectText}>{item.content}</Text>
        <View style={styles.attachedObjectFooter}>
          <Text style={styles.attachedObjectFooterAuthor}>{item.author}</Text>
          <Text style={styles.attachedObjectFooterTimestamp}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  }

  if (item.type === 'comment') {
    return (
      <View style={styles.attachedObject}>
        <Text style={styles.attachedObjectText}>comment</Text>
      </View>
    );
  }

  if (item.type === 'link') {
    return <Card item={item} />;
  }
};

const styles = StyleSheet.create({
  attachedObject: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  attachedObjectText: {
    fontSize: 14,
    lineHeight: 24,
    color: '#364047',
  },
  attachedObjectFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attachedObjectFooterAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#535B61',
  },
  attachedObjectFooterTimestamp: {
    fontSize: 13,
    color: '#535B61',
  },
});

export default AttachedObject;
