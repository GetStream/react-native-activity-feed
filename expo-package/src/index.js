// @flow
import { registerNativeHandlers } from 'react-native-activity-feed-core';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
registerNativeHandlers({

  pickImage: async ({ compressImageQuality = 0.2, maxNumberOfFiles }) => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        return {
          cancelled: true,
        };
      }

      const { cancelled, ...rest } = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        aspect: [4, 3],
        quality: compressImageQuality,
      });

      if (cancelled) {
        return {
          cancelled,
        };
      }
      return {
        cancelled: false,
        uri: rest.uri,
      };
    } catch (err) {
      return {
        cancelled: true,
      };
    }
  },

});

export * from 'react-native-activity-feed-core';
