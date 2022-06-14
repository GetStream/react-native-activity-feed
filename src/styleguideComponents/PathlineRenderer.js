import React from 'react';
import copy from 'clipboard-copy';
import { MdContentCopy } from 'react-icons/md';
import Link from 'react-styleguidist/lib/client/rsg-components/Link';
import ToolbarButton from 'react-styleguidist/lib/client/rsg-components/ToolbarButton';
import Styled from 'react-styleguidist/lib/client/rsg-components/Styled';

export const styles = ({ color, fontFamily, fontSize, space }) => ({
  copyButton: {
    marginLeft: space[0],
  },
  pathline: {
    color: color.light,
    fontFamily: fontFamily.monospace,
    fontSize: fontSize.small,
    wordBreak: 'break-all',
  },
});

export const PathlineRenderer = ({ children, classes }) => (
  <div className={classes.pathline}>
    <Link
      href={
        'https://github.com/GetStream/react-native-activity-feed/blob/master/' +
        children
      }
      rel='noopener'
      target='blank'
    >
      {children}
    </Link>
    <ToolbarButton
      className={classes.copyButton}
      onClick={() => children && copy(children.toString())}
      small
      title='Copy to clipboard'
    >
      <MdContentCopy />
    </ToolbarButton>
  </div>
);

export default Styled(styles)(PathlineRenderer);
