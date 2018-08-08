// @flow
import moment from 'moment';
import type { StylesProps } from './types';

export function humanizeTimestamp(timestamp: string | number): string {
  let time = moment.utc(timestamp); // parse time as UTC
  let now = moment();
  // Not in future humanized time
  return moment.min(time, now).from(now);
}

export function mergeStyles(
  name: string,
  base: any,
  props: { ...StylesProps }, // make StylesProps not exact
  ...extra: Array<?{}>
): any {
  let propStyle;
  if (props.styles) {
    propStyle = props.styles[name];
  }
  return [base[name], propStyle, ...extra];
}
