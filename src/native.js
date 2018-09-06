// @flow
import { Platform } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

export let pickImage = () => {
  throw Error(
    'Native handler was not registered, you should import expo-activity-feed or react-native-activity-feed',
  );
};

export const registerNativeHandlers = (handlers: {
  pickImage: typeof pickImage,
}) => {
  if (handlers.pickImage) {
    pickImage = handlers.pickImage;
  }
};

export let androidTranslucentStatusBar = false;

export const setAndroidTranslucentStatusBar = (translucent: boolean = true) => {
  if (Platform.OS === 'android') {
    androidTranslucentStatusBar = translucent;
    if (translucent) {
      SafeAreaView.setStatusBarHeight(24);
    } else {
      SafeAreaView.setStatusBarHeight(0);
    }
  }
};
