import * as React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import Button from '../../../components/Button';
import { RootStore, setSession, TypeOfConnect } from '../../../redux';
import API from '../../../api';
import { useHistory } from 'react-router-dom';
import Config from '../../../config';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { setSession },
    null,
    { pure: false },
);

type ILogoutProps = TypeOfConnect<typeof storeEnhancer>;

const Logout: React.FC<ILogoutProps> = ({ setSession, user }: ILogoutProps) => {
    if (!user) {
        return null;
    }
    const [loading, setLoading] = React.useState(false);
    const history = useHistory();

    const back = () => history.replace('/');

    const onClick = () => {
        setLoading(true);
        localStorage.removeItem(Config.SKL_AUTH_KEY);
        void API.users.logout().then(() => {
            setSession(null, null);
            back();
        });
    };

    return (
        <div className="logout">
            <h2>Вы уверены, что хотите выйти из аккаунта @{user.login}?</h2>
            <img src={user.photo.photo200} alt="" />
            <div className="logout-buttons">
                <Button label="Нет" size='l' color="negative" disabled={loading} onClick={back} />
                <Button label="Да" size='l' color="attention" loading={loading} onClick={onClick} />
            </div>
        </div>
    );
};

export default storeEnhancer(Logout);
