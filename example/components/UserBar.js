// @flow
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { humanizeTimestamp } from '../utils';

import Avatar from './Avatar';
import FollowButton from './FollowButton';

type Props = {
  onPressAvatar?: () => any,
  style?: any,
  data: {
    username: ?string,
    image?: string,
    subtitle?: string,
    time?: string, // text that should be displayed as the time
    timestamp?: string | number, // a timestamp that should be humanized
    icon?: string,
  },
  extraStyle?: {
    fontWeightAuthor?: string,
  },
  follow?: boolean,
};

const UserBar = ({
  style,
  data,
  follow,
  onPressAvatar,
  extraStyle = {},
}: Props) => {
  const { subtitle, username = 'Unknown', image, icon } = data;
  let time = data.time;
  if (time === undefined && data.timestamp != null) {
    time = humanizeTimestamp(data.timestamp);
  }

  return (
    <View style={[styles.container, { ...style }]}>
      {image ? (
        <TouchableOpacity onPress={onPressAvatar}>
          <Avatar
            source={image}
            size={48}
            noShadow
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ) : null}

      <View style={styles.content}>
        <Text
          style={[styles.username, { fontWeight: extraStyle.fontWeightAuthor }]}
        >
          {username}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          {icon !== undefined ? (
            <Image
              source={icon}
              style={{ width: 24, height: 24, top: -2, marginRight: 5 }}
            />
          ) : null}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {time && (
        <View>
          <Text style={styles.timestamp}>{time}</Text>
        </View>
      )}
      {follow && (
        <View>
          <FollowButton />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  username: {
    fontSize: 17,
    fontWeight: '300',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.8,
    fontWeight: '300',
  },
  timestamp: {
    fontSize: 13,
    opacity: 0.8,
    fontWeight: '300',
  },
});

export default UserBar;
