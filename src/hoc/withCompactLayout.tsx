import * as React from 'react';
import withClassBody from './withClassBody';

export default (Child: React.ComponentType) => withClassBody('body__compact')(Child);
