import React, { useState } from 'react'
import { Api } from '../service/api'

const RegisterForm = ({api, afterCallback}: {api: Api, afterCallback: () => void}) => {
    const [login, setLogin] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repeatePassword, setRepeatePassword] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')

    const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        if (password !== repeatePassword) {
            alert('Пароли должны совпадать')
            return
        }

        api.register({login, password, firstName, lastName})
            .then(() => {
                alert('Вы успешно зарегистрировались')
                afterCallback()
            })
            .catch(() => alert('Ошибка во время регистрации!'))
    }

    return (
        <form className='form' onSubmit={submit}>
            <div className='form-control'>
                <label>Логин*</label>
                <input className="input input-block" type="string" required value={login} onChange={(e) => setLogin(e.target.value)}/>
            </div>

            <div className='form-control'>
                <label>Пароль*</label>
                <input className="input input-block" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <div className='form-control'>
                <label>Повторите пароль*</label>
                <input className="input input-block" type="password" required value={repeatePassword} onChange={(e) => setRepeatePassword(e.target.value)}/>
            </div>

            <div className='form-control'>
                <label>Фамилия*</label>
                <input className="input input-block" type="string" required value={lastName} onChange={(e) => setLastName(e.target.value)}/>
            </div>

            <div className='form-control'>
                <label>Имя*</label>
                <input className="input input-block" type="string" required value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
            </div>

            <div className='form-control'>
                <input className='btn btn-block' type="submit" value="Зарегистрироваться" />
            </div>
        </form>
    )
}

export default RegisterForm
