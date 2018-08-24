// @flow
import { registerNativeHandlers } from 'react-native-activity-feed-core';
import { ImagePicker, Permissions } from 'expo';
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
export type { AppCtx } from 'react-native-activity-feed-core';
