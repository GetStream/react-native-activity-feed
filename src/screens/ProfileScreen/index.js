import React from 'react';

import ProfileHeader from '../../components/ProfileHeader';




export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: 'Batman',
        url: 'batsignal.com',
        desc: 'Smart, violent and brutally tough solutions to crime.',
        profileImage: 'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
        coverImage: 'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
        counts: {
          following: 3000,
          followers: 1200000
        }
      }
    }
  }
  render() {
    return (
      <ProfileHeader user={this.state.user} navigation={this.props.navigation}/>
    );
  }
}

