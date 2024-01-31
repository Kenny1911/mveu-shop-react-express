import React, { useEffect, useState } from 'react'
import { Api } from '../service/api'

const AccountForm = ({api}: {api: Api}) => {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')

    useEffect(() => {
        api.getUser().then(u => {
            setFirstName(u?.firstName ?? '')
            setLastName(u?.lastName ?? '')
        })
    }, [])

    const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        
        api.editUser({firstName, lastName}).then(() => alert('Ваши данные успешно изменены')).catch(() => alert('Произошла ошибка!'))
    }

    return (
        <form className="form" onSubmit={submit}>
            <div className='form-control'>
                <label>Имя*</label>
                <input className='input input-block' type="text" value={firstName} onChange={ (e) => setFirstName(e.target.value) } required />
            </div>

            <div className='form-control'>
                <label>Фамилия*</label>
                <input className="input input-block" type="text" value={lastName} onChange={ (e) => setLastName(e.target.value) } required />
            </div>

            <div className='form-control'>
                <input className="btn btn-block" type="submit" value="Сохранить" />
            </div>
        </form>
    )
}

export default AccountForm
