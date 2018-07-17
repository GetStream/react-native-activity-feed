import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import UserBar from '../UserBar';
import PostControlBar from '../PostControlBar';
import Card from '../Card';

class Activity extends React.Component {
  constructor(props) {
    super(props);
  }

  _onPress = () => {
    this.props.onItemPress();
  };

  render() {
    const { width } = Dimensions.get('window');
    let icon, sub;
    if (this.props.type === 'like') {
      icon = require('../../images/icons/heart.png');
    }
    if (this.props.type === 'repost') {
      icon = require('../../images/icons/repost.png');
    }
    if (this.props.type === 'reply') {
      icon = require('../../images/icons/reply.png');
      sub = `reply to ${this.props.to}`;
    }

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this._onPress.bind(this)}
        disabled={this.props.static}
      >
        <View style={{ padding: 15 }}>
          <UserBar
            onPressAvatar={() => this.props.onAvatarPress(this.props.id)}
            data={{
              username: this.props.author.name,
              image: this.props.author.user_image,
              handle: sub,
              time: this.props.time ? this.props.time : '',
              icon: icon,
            }}
          />
        </View>
        <View style={{ paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}>
          <Text>{this.props.content}</Text>
        </View>

        {this.props.link && (
          <View style={{ paddingLeft: 15, paddingRight: 15 }}>
            <Card item={this.props.object} />
          </View>
        )}

        {this.props.image && (
          <Image
            style={{ width: width, height: width }}
            source={{ uri: this.props.image }}
          />
        )}

        <View style={{ paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}>
          <PostControlBar
            data={{
              repost: {
                'icon-outline': require('../../images/icons/repost.png'),
                'icon-filled': require('../../images/icons/repost.png'),
                value: 13,
                style: 'icon-outline',
              },
              heart: {
                'icon-outline': require('../../images/icons/heart-outline.png'),
                'icon-filled': require('../../images/icons/heart.png'),
                value: 22,
                style: 'icon-filled',
              },
              reply: {
                'icon-outline': require('../../images/icons/reply.png'),
                'icon-filled': require('../../images/icons/reply.png'),
                value: 3,
                style: 'icon-outline',
              },
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
  },
});

export default Activity;
