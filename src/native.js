export let pickImage = () => {
  throw Error(
    'Native handler was not registered, you should import expo-activity-feed or react-native-activity-feed',
  );
};

export const registerNativeHandlers = (handlers) => {
  if (handlers.pickImage) {
    pickImage = handlers.pickImage;
  }
};
