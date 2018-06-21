import React  from 'react';
import {View, Image, Text} from 'react-native';

const Icon = ({name}) => {
  if (name === 'home') {
    return <Image source={require('../../images/icons/home.png') } style={{ width: 30, height: 30}} />;
  } else if (name === 'notifications') {
    return <Image source={require("../../images/icons/notifications.png") } style={{ width: 30, height: 30}} />;
  } else if (name === 'search') {
    return <Image source={require("../../images/icons/search.png") } style={{ width: 30, height: 30}} />;
  }
}

export default Icon;
