// @flow
import moment from 'moment';
export function humanizeTimestamp(timestamp: string): string {
  let time = moment.utc(timestamp); // parse time as UTC
  let now = moment();
  // Not in future humanized time
  return moment.min(time, now).from(now);
}
