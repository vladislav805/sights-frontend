import * as React from 'react';
import { withClassBody } from '.';

export const CLASS_COMPACT = 'body__compact';
export const withCompactDesign = (Child: React.ComponentType) => withClassBody(CLASS_COMPACT)(Child);
