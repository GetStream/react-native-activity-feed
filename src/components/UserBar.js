//
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { humanizeTimestamp } from '../utils';

import Avatar from './Avatar';
import FollowButton from './FollowButton';

import { buildStylesheet } from '../styles';
import { withTranslationContext } from '../Context';

/**
 * A compact horizontal user information box (it is used as activities' header)
 * @example ./examples/UserBar.md
 */
const UserBar = withTranslationContext(
  ({
    username,
    subtitle,
    avatar,
    follow,
    onPressAvatar,
    icon,
    tDateTimeParser,
    ...props
  }) => {
    username = username || 'Unknown';
    let time = props.time;
    if (time === undefined && props.timestamp != null) {
      time = humanizeTimestamp(props.timestamp, tDateTimeParser);
    }

    const styles = buildStylesheet('userBar', props.styles);

    return (
      <View style={styles.container}>
        {avatar ? (
          <TouchableOpacity onPress={onPressAvatar} disabled={!onPressAvatar}>
            <Avatar
              source={avatar}
              size={48}
              noShadow
              styles={
                (styles && styles.avatar) || { container: { marginRight: 10 } }
              }
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
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        {time && (
          <View>
            <Text style={styles.time}>{time}</Text>
          </View>
        )}
        {follow && (
          <View>
            <FollowButton followed />
          </View>
        )}
      </View>
    );
  },
);

export default UserBar;
