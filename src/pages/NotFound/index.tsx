import * as React from 'react';
import { mdiCat } from '@mdi/js';
import InfoSplash from '../../components/InfoSplash';

const NotFound: React.FC = () => (
    <InfoSplash
        icon={mdiCat}
        title="404"
        description="Страница не найдена ¯\_(ツ)_/¯" />
);

export default NotFound;
