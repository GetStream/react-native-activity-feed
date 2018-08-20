import { registerNativeHandlers } from 'react-native-activity-feed-core';
import ImagePicker from 'react-native-image-picker';
registerNativeHandlers({
  pickImage: async () => {
    return new Promise((resolve, reject) => {
      ImagePicker.launchImageLibrary(null, (response) => {
        if (response.error) {
          reject(Error(response.error));
        }

        resolve({
          cancelled: response.didCancel,
          uri: response.uri,
        });
      });
    });
  },
});

export * from 'react-native-activity-feed-core';
