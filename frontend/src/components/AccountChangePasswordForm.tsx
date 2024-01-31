import React, { useState } from 'react'
import { Api } from '../service/api'

const AccountChangePasswordForm = ({api}: {api: Api}) => {
    const [password, setPassword] = useState<string>('')
    const [repeatePassword, setRepeatePassword] = useState<string>('')

    const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        if (password !== repeatePassword) {
            alert('Пароли не совпадают!');
            return
        }
        
        api.changePassword(password)
        .then(() => {
            alert('Пароль успешно изменен')
            setPassword('')
            setRepeatePassword('')
        })
        .catch(() => alert('Произошла ошибка!'))
    }


    return (
        <form className="form" onSubmit={submit}>
            <div className='form-control'>
                <label>Пароль*</label>
                <input className="input input-block" type="password" value={password} onChange={ (e) => setPassword(e.target.value) } required />
            </div>

            <div className='form-control'>
                <label>Повторите пароль*</label>
                <input className="input input-block" type="password" value={repeatePassword} onChange={ (e) => setRepeatePassword(e.target.value) } required />
            </div>

            <div className='form-control'>
                <input className='btn btn-block' type="submit" value="Сохранить" />
            </div>
        </form>
    )
}

export default AccountChangePasswordForm
