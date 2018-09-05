// @flow

import type { FlowRequestTypes } from './types';
export const handleError = (
  error: Error,
  type: FlowRequestTypes,
  detail: Object,
) => {
  console.warn(error);
  let text = 'Something went wrong';
  let suffix = '';
  switch (type) {
    case 'get-user-info':
      text += ' when loading user info';
      break;
    case 'get-feed':
      text += ' when loading the feed';
      break;
    case 'get-feed-next-page':
      text += ' when loading the next page of the feed';
      break;
    case 'get-notification-counts':
      text += ' when loading your unread notification counts';
      break;
    case 'upload-image':
      text += ' when uploading your image';
      suffix = ' If it is, the image is probably too big';
      break;
    case 'add-activity':
      text += ' when submitting your post';
      break;
    case 'add-reaction':
      text += ' when submitting your ' + detail.kind;
      break;
    case 'delete-reaction':
      text += ' when removing your ' + detail.kind;
      break;
  }

  text += '. Is your internet working?' + suffix;
  alert(text);
};
