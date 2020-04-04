import * as React from 'react';
import './style.scss';
import AuthorizeForm from '../../../components/AuthorizeForm';

const Login = () => (
    <div className="login-container">
        <h1>Авторизация</h1>
        <AuthorizeForm />
    </div>
);

export default Login;
