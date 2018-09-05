// @flow
import React from 'react';
import { View, Image } from 'react-native';

import UploadImage from './UploadImage';
import { StreamApp } from '../Context';
import { buildStylesheet } from '../styles';

import type { StyleSheetLike } from '../types';
import type { UserResponse } from 'getstream';

export type Props = {|
  /** The image source or a getter fn */
  source: ?string | ((activeUser: UserResponse<Object>) => ?string),
  size?: number,
  editButton?: boolean,
  noShadow?: boolean,
  notRound?: boolean,

  onUploadButtonPress?: () => mixed,
  styles?: StyleSheetLike,
|};

/**
 * A users' profile picture
 * @example ./examples/Avatar.md
 */
export default class Avatar extends React.Component<Props> {
  render() {
    let { source, ...props } = this.props;
    if (typeof source === 'function') {
      let funcSource = source;
      return (
        <StreamApp.Consumer>
          {(appCtx) => {
            if (appCtx.user.full) {
              source = funcSource(appCtx.user.full);
            } else {
              source = undefined;
            }
            return <AvatarInner {...props} source={source} />;
          }}
        </StreamApp.Consumer>
      );
    } else {
      return <AvatarInner {...props} source={source} />;
    }
  }
}

type InnerProps = {| ...Props, source: ?string |};

const AvatarInner = (props: InnerProps) => {
  let {
    source,
    size = 200,
    noShadow,
    notRound,
    editButton,
    onUploadButtonPress,
  } = props;
  let styles = buildStylesheet('avatar', props.styles || {});
  let borderRadius = notRound ? undefined : size / 2;
  return (
    <View
      style={[
        styles.container,
        noShadow ? styles.noShadow : null,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Image
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: borderRadius,
          },
        ]}
        source={source ? { uri: source } : require('../images/placeholder.png')}
      />
      {editButton ? (
        <UploadImage onUploadButtonPress={onUploadButtonPress} />
      ) : null}
    </View>
  );
};
