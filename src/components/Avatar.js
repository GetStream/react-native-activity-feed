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
class Avatar extends React.Component<Props> {
  render = function() {
    let {
      source,
      size = 200,
      noShadow,
      notRound,
      editButton,
      onUploadButtonPress,
    } = this.props;
    let styles = buildStylesheet('avatar', this.props.styles || {});
    let borderRadius = notRound ? undefined : size / 2;

    return (
      <StreamApp.Consumer>
        {(appCtx) => {
          if (typeof source === 'function') {
            if (appCtx.user.full) {
              source = source(appCtx.user.full);
            } else {
              source = undefined;
            }
          }
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
                source={
                  source
                    ? { uri: source }
                    : require('../images/placeholder.png')
                }
              />
              {editButton ? (
                <UploadImage onUploadButtonPress={onUploadButtonPress} />
              ) : null}
            </View>
          );
        }}
      </StreamApp.Consumer>
    );
  };
}
export default Avatar;
