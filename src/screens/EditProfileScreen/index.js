import React from 'react';
import { StatusBar, View, Text, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CoverImage from "../../components/CoverImage";
import Avatar from "../../components/Avatar";
import BackButton from "../../components/BackButton";
import UploadImage from '../../components/UploadImage';




export default class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: 'Batman',
        url: 'batsignal.com',
        desc: 'Smart, violent and brutally tough solutions to crime.',
        profileImage: 'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
        coverImage: 'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg',
        counts: {
          following: 3000,
          followers: 1200000
        }
      }
    }
  }

  static navigationOptions = ({navigation}) => ({
    title: 'Edit Profile'.toUpperCase(),
    headerRight: <Text>Save</Text>,
    headerLeft: <BackButton pressed={() => navigation.goBack() } color="blue" />,
    headerStyle: {
      paddingLeft: 15,
      paddingRight: 15,
    },
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13
    }
  });

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView style={{flex: 1, backgroundColor: "#ffffff"}}>
        <CoverImage source={this.state.user.coverImage} size={150} />
        <View style={{flexDirection: 'row', alignItems: 'flex-end', paddingRight: 15, paddingLeft: 15, height: 200}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 100 + '%'}}>
            <Avatar source={this.state.user.profileImage} size={100} editButton />
            <UploadImage />
          </View>
        </View>
        <View style={{padding: 15}}>
          <View style={{borderBottomWidth: 1, borderBottomColor: '#dcdcdc', marginBottom: 15}}>
            <Text style={{ marginBottom: 12, fontSize: 14, color: '#C5C5C5'}}>Name</Text>
            <TextInput value={this.state.user.name} style={{ fontSize: 16, fontWeight: '500' , color: '#364047', paddingBottom:10}}/>
          </View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#dcdcdc', marginBottom: 15 }}>
            <Text style={{ marginBottom: 12, fontSize: 14, color: '#C5C5C5' }}>Website</Text>
            <TextInput value={this.state.user.url} style={{ fontSize: 16, fontWeight: '500' , color: '#364047', paddingBottom:10 }} />
          </View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#dcdcdc', marginBottom: 15 }}>
            <Text style={{ marginBottom: 12, fontSize: 14, color: '#C5C5C5' }}>Description</Text>
            <TextInput value={this.state.user.desc} style={{ fontSize: 16, fontWeight: '500' , color: '#364047', paddingBottom: 10 }} multiline={true} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

