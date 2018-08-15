// @flow
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { humanizeTimestamp, mergeStyles } from '../utils';

import Avatar from './Avatar';
import FollowButton from './FollowButton';
import type { StylesProps } from '../types';
import { buildStylesheet } from '../styles';

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

  let styles = buildStylesheet('userBar', props.styles);

  return (
    <View style={mergeStyles('container', styles, props)}>
      {avatar ? (
        <TouchableOpacity onPress={onPressAvatar}>
          <Avatar
            source={avatar}
            size={48}
            noShadow
            styles={styles && styles.avatar || { container: { marginRight: 10 }}}
          />
        </TouchableOpacity>
      ) : null}

      <View style={styles.content}>
        <Text style={styles.username}>{username}</Text>
        <View style={{ flexDirection: 'row' }}>
          {icon !== undefined ? (
            <Image
              source={icon}
              style={{ width: 24, height: 24, top: -2, marginRight: 5 }}
            />
          ) : null}
          {subtitle && (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {time && (
        <View>
          <Text style={styles.time}>{time}</Text>
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

export default UserBar;
