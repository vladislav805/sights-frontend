import * as React from 'react';
import './style.scss';
import { Route, Switch } from 'react-router-dom';
import Menu from '../Menu';
import LoadingSpinner from '../LoadingSpinner';
import { routes } from '../../route/routes';
import Config from '../../config';

type IMenuProps = {
    menu: boolean;
    closeMenu: () => void;
};

const switches = (
    <Switch>
        {routes.map(props => React.createElement(Route, props))}
    </Switch>
);

/**
 * Костыли с рендерами вместо component необходимы для корректного свича
 * @see https://github.com/ReactTraining/react-router/issues/4578
 */
const Main: React.FC<IMenuProps> = ({ menu, closeMenu }: IMenuProps) => (
    <div className="main">
        <div className="main-container">
            <Menu isOpen={menu} close={closeMenu} />
            <main>
                {Config.isServer ? switches : (
                    <React.Suspense fallback={<LoadingSpinner block />}>
                        {switches}
                    </React.Suspense>
                )}
            </main>
        </div>
    </div>
);

export default Main;
