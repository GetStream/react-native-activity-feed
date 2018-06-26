import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import Avatar from "../../Avatar";

const Like = ({ item }) => {
  let headerText
  if (Array.isArray(item.actors)) {
    headerText = `${item.actors[0].user_name} and ${item.actors.length - 1} others `;
  } else {
    headerText = item.actor.username;
  }
  return (
    <View style={styles.item}>
      <Avatar source={item.actors[0].user_image} size={48} noShadow />
      <View style={{ flex: 1, paddingLeft: 15 }}>
        <Text style={styles.itemHeader}>{headerText}</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require('../../../images/icons/heart.png')} />
          <Text style={styles.itemSubheader}>
              liked your {item.object.type}
          </Text>
        </View>


        <View style={styles.object}>
          <Text style={styles.objectText}>{item.object.content}</Text>
          <View style={styles.objectFooter}>
            <Text style={styles.objectFooterAuthor}>{item.object.author}</Text>
            <Text style={styles.objectFooterTimestamp}>{item.object.timestamp}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#DADFE3",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: "row"
  },
  itemHeader: {
    fontSize: 17,
    color: "#000",
    opacity: 0.9,
    lineHeight: 24
  },
  itemSubheader: {
    fontSize: 17,
    lineHeight: 24,
    opacity: 0.7
  },
  object: {
    paddingTop: 10,
    paddingBottom: 10
  },
  objectText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#364047"
  },
  objectFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  objectFooterAuthor: {
    fontSize: 13,
    fontWeight: "600",
    color: "#535B61"
  },
  objectFooterTimestamp: {
    fontSize: 13,
    color: "#535B61"
  }
});

export default Like;