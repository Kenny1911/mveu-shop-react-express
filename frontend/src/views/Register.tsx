import React from 'react';
import RegisterForm from '../components/RegisterForm'
import { Api } from '../service/api';

const Register = ({api, setPage}: {api: Api, setPage: (value: string) => void}) => {
    return (
        <div className='register'>
            <h1>Регистрация</h1>
            <RegisterForm api={api} afterCallback={() => setPage('Login')} />
        </div>
    )
}

export default Register
