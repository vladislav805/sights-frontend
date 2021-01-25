import * as React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import Button from '../../../components/Button';
import { setSession, TypeOfConnect } from '../../../redux';
import API, { setAuthKey } from '../../../api';
import { useHistory } from 'react-router-dom';
import { SKL_AUTH_KEY } from '../../../config';
import { setCookie } from '../../../utils/cookie';
import useCurrentUser from '../../../hook/useCurrentUser';
import { withSessionOnly } from '../../../hoc/withSessionOnly';

const withStore = connect(
    () => ({}),
    { setSession },
);

type ILogoutProps = TypeOfConnect<typeof withStore>;

const Logout: React.FC<ILogoutProps> = ({ setSession }: ILogoutProps) => {
    const user = useCurrentUser();
    const [loading, setLoading] = React.useState(false);
    const history = useHistory();

    if (!user) {
        return null;
    }

    const back = () => history.replace('/');

    const onClick = () => {
        setLoading(true);
        setCookie(SKL_AUTH_KEY, null);
        void API.account.logout().then(() => {
            setAuthKey(null);
            setSession(null, null);
            setCookie(SKL_AUTH_KEY, null);
            back();
        });
    };

    return (
        <div className="logout">
            <h2>Вы уверены, что хотите выйти из аккаунта @{user.login}?</h2>
            {user.photo && <img src={user.photo.photo200} alt="" />}
            <div className="logout-buttons">
                <Button label="Нет" size='l' color="negative" disabled={loading} onClick={back} />
                <Button label="Да" size='l' color="attention" loading={loading} onClick={onClick} />
            </div>
        </div>
    );
};

export default withSessionOnly(withStore(Logout));
