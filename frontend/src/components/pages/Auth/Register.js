import { useContext, useState } from "react"
import Input from "../../form/Input"
import { Link } from "react-router-dom"
import styles from "../../form/Form.module.css"

/* contexts */
import { Context } from "../../../context/UserContext"

function Register() {
    const[user, setUser] = useState({})
    const {register} = useContext(Context)
    
    function handleChange(e) {
        setUser({...user, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()
        //send user to bank
        register(user)
    }
    
    return (
        <section className={styles.form_container}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <Input
                text="Nome"
                type="text"
                name="name"
                placeholder="Your name"
                handleOnChange={handleChange}
                />
                  <Input
                text="Phone"
                type="text"
                name="phone"
                placeholder="Your phone"
                handleOnChange={handleChange}
                />
                  <Input
                text="Email"
                type="text"
                name="email"
                placeholder="Your email"
                handleOnChange={handleChange}
                />
                <Input
                text="Password"
                type="password"
                name="password"
                placeholder="Your password"
                handleOnChange={handleChange}
                />
                <Input
                text="Password"
                type="passwprd"
                name="confirmpassword"
                placeholder="Please confirm your password"
                handleOnChange={handleChange}
                />
                <input type="submit" value="Register"/>                
            </form>
            <p>
                Already has an account? <Link to="/login">Click Here</Link>
            </p>
        </section>
    )
}

export default Register