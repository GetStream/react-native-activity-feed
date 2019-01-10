// @flow
import * as React from 'react';
import moment from 'moment';
import type { Renderable, RenderableButNotElement } from './types';

export function humanizeTimestamp(timestamp: string | number): string {
  let time = moment.utc(timestamp); // parse time as UTC
  let now = moment();
  // Not in future humanized time
  return moment.min(time, now).from(now);
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
