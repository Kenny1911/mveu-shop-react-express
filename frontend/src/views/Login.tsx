import { Api, User } from "../service/api"
import { FormEventHandler } from "react"

interface LoginArgs {
    api: Api
    setUser: (value: User|null) => void
    setPage: (value: string) => void
}

const Login = ({api, setUser, setPage}: LoginArgs) => {
    const submit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const form = e.target as typeof e.target & {
            login: {value: string},
            password: {value: string},
        }

        try {
            const res = await api.login(form.login.value, form.password.value)
            api.setToken(res.token)
        } catch (r) {
            let r2 = r as {message?: string}
            alert('Ошибка! Не верный логин или пароль!')
            return
        }

        const user = await api.getUser()
        setUser(user)
        setPage('ProductsList')
    }
    return (
        <div className="login">
            <h1>Авторизация</h1>

            <form className="form" onSubmit={submit}>
                <div className="form-control">
                    <label>Логин:*</label>
                    <input className="input input-block" type="string" name="login" required />
                </div>

                <div className="form-control">
                    <label>Пароль:*</label>
                    <input className="input input-block" type="password" name="password" required />
                </div>

                <div className="form-control">
                    <input className="btn btn-block" type="submit" value="Войти" />
                </div>
            </form>
        </div>
    )
}

export default Login