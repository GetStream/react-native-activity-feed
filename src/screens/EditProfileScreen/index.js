import React from 'react';
import { StatusBar, View, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CoverImage from '../../components/CoverImage';
import Avatar from '../../components/Avatar';
import BackButton from '../../components/BackButton';
import UploadImage from '../../components/UploadImage';
import FormField from '../../components/FormField';

export default class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: 'Batman',
        url: 'batsignal.com',
        desc: 'Smart, violent and brutally tough solutions to crime.',
        profileImage:
          'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
        coverImage:
          'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg',
        counts: {
          following: 3000,
          followers: 1200000,
        },
      },
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'EDIT PROFILE',
    headerRight: <Text>Save</Text>,
    headerLeft: <BackButton pressed={() => navigation.goBack()} color="blue" />,
    headerStyle: {
      paddingLeft: 15,
      paddingRight: 15,
    },
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13,
    },
  });

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <CoverImage source={this.state.user.coverImage} size={150} />
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
            <Avatar
              source={this.state.user.profileImage}
              size={100}
              editButton
            />
            <UploadImage />
          </View>
        </View>
        <View style={{ padding: 15 }}>
          <FormField value={this.state.user.name} label={'Name'} />
          <FormField value={this.state.user.url} label={'Website'} />
          <FormField
            value={this.state.user.desc}
            label={'Description'}
            multiline
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
