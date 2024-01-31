import React from 'react';
import AccountForm from '../components/AccountForm'
import AccountChangePasswordForm from '../components/AccountChangePasswordForm'
import { Api } from '../service/api';

const Account = ({api}: {api: Api}) => {
    return (
        <div className='account'>
            <h1>Мой аккаунт</h1>

            <div className="account-form">
                <h3>Редактировать</h3>
                <AccountForm api={api} />
            </div>

            <div className='account-change-password-form'>
                <h3>Сменить пароль</h3>
                <AccountChangePasswordForm api={api} />
            </div>
        </div>
    )
}

export default Account