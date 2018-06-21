import React from "react";
import {View, Text, StyleSheet, Image } from "react-native";

import Avatar from "../Avatar";

const Notification = ({item}) => {
  return (
    <View style={styles.item}>
      <Avatar source="https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg" size={48} noShadow />
      <View style={{ flex: 1, paddingLeft: 15 }}>
        <Text style={styles.itemHeader}>TheBatman and 3 others</Text>
        {/* <Text style={styles.itemSubheader}>{ item.type === 'like' && 'liked'} your {item.object.type}:</Text> */}


        { item.type === 'like' ?
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Image
              style={{ width: 24, height: 24}}
              source={require('../../images/icons/heart.png')} />
            <Text style={styles.itemSubheader}>
              liked your {item.object.type}
            </Text>
          </View>
        : null }


        <View style={styles.object}>
          <Text style={styles.objectText}>Great podcast with @getstream and @feeds! Thanks guys!</Text>
          <View style={styles.objectFooter}>
            <Text style={styles.objectFooterAuthor}>@Wonderwoman</Text>
            <Text style={styles.objectFooterTimestamp}>2 mins</Text>
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

export default Notification;