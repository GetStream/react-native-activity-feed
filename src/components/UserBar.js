// @flow
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { humanizeTimestamp, mergeStyles } from '../utils';

import Avatar from './Avatar';
import FollowButton from './FollowButton';
import type { StylesProps } from '../types';

type Props = {|
  username: ?string,
  avatar?: string,
  subtitle?: string,
  time?: string, // text that should be displayed as the time
  timestamp?: string | number, // a timestamp that should be humanized
  icon?: string,

  onPressAvatar?: () => mixed,
  follow?: boolean,
  ...StylesProps,
|};

const UserBar = ({
  username,
  subtitle,
  avatar,
  follow,
  onPressAvatar,
  icon,
  ...props
}: Props) => {
  username = username || 'Unknown';
  let time = props.time;
  if (time === undefined && props.timestamp != null) {
    time = humanizeTimestamp(props.timestamp);
  }

  return (
    <View style={mergeStyles('container', styles, props)}>
      {avatar ? (
        <TouchableOpacity onPress={onPressAvatar}>
          <Avatar
            source={avatar}
            size={48}
            noShadow
            styles={{ container: { marginRight: 10 } }}
          />
        </TouchableOpacity>
      ) : null}

      <View style={mergeStyles('content', styles, props)}>
        <Text style={mergeStyles('username', styles, props)}>{username}</Text>
        <View style={{ flexDirection: 'row' }}>
          {icon !== undefined ? (
            <Image
              source={icon}
              style={{ width: 24, height: 24, top: -2, marginRight: 5 }}
            />
          ) : null}
          {subtitle && (
            <Text style={mergeStyles('subtitle', styles, props)}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {time && (
        <View>
          <Text style={mergeStyles('time', styles, props)}>{time}</Text>
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
  time: {
    fontSize: 13,
    opacity: 0.8,
    fontWeight: '300',
  },
});

export default UserBar;
