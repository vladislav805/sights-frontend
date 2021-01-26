import * as React from 'react';
import './style.scss';
import { Route, Switch } from 'react-router-dom';
import Menu from '../Menu';
import LoadingSpinner from '../LoadingSpinner';
import { routes } from '../../route/routes';
import Config from '../../config';
import { IUser } from '../../api/types/user';
import SessionContext from '../../utils/session-context';
import { connect } from 'react-redux';
import { RootStore, TypeOfConnect } from '../../redux';

const withStore = connect(
    (store: RootStore) => ({ user: store.user }),
    {},
);

type IMenuProps = {
    menu: boolean;
    closeMenu: () => void;
} & TypeOfConnect<typeof withStore>;

const switches = (
    <Switch>
        {routes.map(props => React.createElement(Route, props))}
    </Switch>
);

const Main: React.FC<IMenuProps> = ({ menu, closeMenu, user }: IMenuProps) => {
    const [currentUser, setCurrentUser] = React.useState<IUser>(undefined);

    React.useEffect(() => setCurrentUser(user), [user]);

    return (
        <SessionContext.Provider value={currentUser}>
            <div className="main" data-loading={!currentUser}>
                <div className="main-container">
                    {currentUser === undefined
                        ? (
                            <LoadingSpinner
                                block
                                subtitle="Ожидание сессии..." />
                        )
                        : (
                            <>
                                <Menu isOpen={menu} close={closeMenu} />
                                <main>
                                    {Config.isServer ? switches : (
                                        <React.Suspense fallback={<LoadingSpinner block />}>
                                            {switches}
                                        </React.Suspense>
                                    )}
                                </main>
                            </>
                        )
                    }
                </div>
            </div>
        </SessionContext.Provider>
    );
}

export default withStore(Main);
