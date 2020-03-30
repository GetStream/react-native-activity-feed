// @flow
import * as React from 'react';
import type { Renderable, RenderableButNotElement } from './types';
import Dayjs from 'dayjs';

export function humanizeTimestamp(
  timestamp: string | number,
  tDateTimeParser: (input?: string | number) => Function = Dayjs,
): string {
  // Following calculation is based on assumption that tDateTimeParser()
  // either returns momentjs or dayjs object.
  const time = tDateTimeParser(timestamp).add(
    Dayjs(timestamp).utcOffset(),
    'minute',
  ); // parse time as UTC
  const now = tDateTimeParser();
  return time.from(now);
}

export const smartRender = (
  ElementOrComponentOrLiteral: Renderable,
  props?: {},
  fallback?: Renderable,
) => {
  if (ElementOrComponentOrLiteral === undefined) {
    ElementOrComponentOrLiteral = fallback;
  }
  if (React.isValidElement(ElementOrComponentOrLiteral)) {
    // Flow cast through any, to make flow believe it's a React.Element
    const element = ((ElementOrComponentOrLiteral: any): React.Element<any>);
    return element;
  }

  // Flow cast through any to remove React.Element after previous check
  const ComponentOrLiteral = ((ElementOrComponentOrLiteral: any): RenderableButNotElement);
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

export function sleep(ms: number): Promise<void> {
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
