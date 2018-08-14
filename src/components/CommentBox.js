// @flow
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

import Avatar from './Avatar';

import { mergeStyles } from '../utils';
import type { StylesProps } from '../types';
import type { Props as AvatarProps } from './Avatar';

type Props = {|
  onSubmit: (string) => mixed,
  height?: number,
  avatarProps?: AvatarProps,
  noAvatar?: boolean,
  ...StylesProps,
|};

type State = {|
  text: string,
|};

export default class CommentBox extends React.Component<Props, State> {
  static defaultProps = {
    height: 78,
  };
  state = {
    text: '',
  };

  render() {
    return (
      <React.Fragment>
        <View style={{ height: this.props.height }} />

        <KeyboardAccessory>
          <View
            style={mergeStyles('container', styles, this.props, {
              height: this.props.height,
            })}
          >
            {this.props.noAvatar || (
              <Avatar size={48} {...this.props.avatarProps} />
            )}
            <TextInput
              value={this.state.text}
              style={styles.textInput}
              placeholder="Your comment..."
              underlineColorAndroid="transparent"
              returnKeyType="send"
              onChangeText={(text) => this.setState({ text })}
              onSubmitEditing={async (event) => {
                this.setState({ text: '' });
                this.props.onSubmit(event.nativeEvent.text);
              }}
            />
          </View>
        </KeyboardAccessory>
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    shadowOffset: { width: 0, height: -3 },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  textInput: {
    flex: 1,
    marginLeft: 25,
    fontSize: 16,
    color: '#364047',
  },
});
