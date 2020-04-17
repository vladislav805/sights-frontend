import * as React from 'react';
import { withClassBody } from '.';

export const CLASS_WIDE = 'body__wide';
export const withWideBody = (Child: React.ComponentType) => withClassBody(CLASS_WIDE)(Child);
