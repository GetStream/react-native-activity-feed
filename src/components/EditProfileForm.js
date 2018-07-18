// @flow

import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CoverImage from './CoverImage';
import Avatar from './Avatar';
import UploadImage from './UploadImage';
import FormField from './FormField';
import type { User, UserData } from '~/types';

type Props = {
  user: User,
  registerSave: (saveFunc: () => void) => void,
};

type State = UserData;

export class EditProfileForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { ...props.user.data };
  }

  componentDidMount() {
    this.props.registerSave(() => {
      this.props.user.update(this.state);
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <CoverImage source={this.state.coverImage} size={150} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingRight: 15,
            paddingLeft: 15,
            height: 200,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: 100 + '%',
            }}
          >
            <Avatar source={this.state.profileImage} size={100} editButton />
            <UploadImage />
          </View>
        </View>
        <View style={{ padding: 15 }}>
          <FormField
            value={this.state.name}
            label={'Name'}
            onChangeText={(text) => this.setState({ name: text })}
          />
          <FormField
            value={this.state.url}
            label={'Website'}
            onChangeText={(text) => this.setState({ url: text })}
          />
          <FormField
            value={this.state.desc}
            label={'Description'}
            onChangeText={(text) => this.setState({ desc: text })}
            multiline
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
