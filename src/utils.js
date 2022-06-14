//
import * as React from 'react';

import Dayjs from 'dayjs';

export function humanizeTimestamp(timestamp, tDateTimeParser) {
  let time;
  // Following calculation is based on assumption that tDateTimeParser()
  // either returns momentjs or dayjs object.

  // When timestamp doesn't have z at the end, we are supposed to take it as UTC time.
  // Ideally we need to adhere to RFC3339. Unfortunately this needs to be fixed on backend.
  if (
    typeof timestamp === 'string' &&
    timestamp[timestamp.length - 1].toLowerCase() === 'z'
  ) {
    time = tDateTimeParser(timestamp);
  } else {
    time = tDateTimeParser(timestamp).add(
      Dayjs(timestamp).utcOffset(),
      'minute',
    ); // parse time as UTC
  }

  const now = tDateTimeParser();
  return time.from(now);
}

// https://reactnative.dev/docs/linking
export const sanitizeUrlForLinking = (url) => {
  if (!/^https?:\/\//.test(url)) {
    url = `https://${url}`;
  }

  return url.replace(/(www\.)/, '');
};

export const smartRender = (ElementOrComponentOrLiteral, props, fallback) => {
  if (ElementOrComponentOrLiteral === undefined) {
    ElementOrComponentOrLiteral = fallback;
  }
  if (React.isValidElement(ElementOrComponentOrLiteral)) {
    // Flow cast through any, to make flow believe it's a React.Element
    const element = ElementOrComponentOrLiteral;
    return element;
  }

  // Flow cast through any to remove React.Element after previous check
  const ComponentOrLiteral = ElementOrComponentOrLiteral;
  if (
    typeof ComponentOrLiteral === 'string' ||
    typeof ComponentOrLiteral === 'number' ||
    typeof ComponentOrLiteral === 'boolean' ||
    ComponentOrLiteral == null
  ) {
    return ComponentOrLiteral;
  }
  return <ComponentOrLiteral {...props} />;
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// https://stackoverflow.com/a/6860916/2570866
export function generateRandomId() {
  // prettier-ignore
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
