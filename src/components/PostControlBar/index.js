import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

import PostControl from './PostControl'

const PostControlBar = ({data}) => {

  let list = Object
    .keys(data)
    .map((item, index) => <PostControl key={index} type={item} num={data[item]} />);


  return <View style={styles.container}>
      {list}
    </View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 100 + '%',
    marginTop: 12,
    marginBottom: 12
  },
  controlImage: {
    height: 24,
    width: 24,
    marginRight: 40
  }
})

export default PostControlBar;