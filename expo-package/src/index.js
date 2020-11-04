// @flow
import { registerNativeHandlers } from 'react-native-activity-feed-core';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
registerNativeHandlers({
  pickImage: async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    return await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
    });
  },
});

export * from 'react-native-activity-feed-core';
