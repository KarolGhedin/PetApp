import { Link } from "react-router-dom"
import { useContext } from "react"

import styles from './Navbar.module.css'
import Logo from '../../assets/Logo.png'

/* context */
import {Context} from "../../context/UserContext"

function Navbar() {

    const {authenticated, logout} = useContext(Context)

    return(
       <nav className={styles.navbar}>
        <div className={styles.navbar_logo}>
            <img src={Logo} alt="Get a Pet" />
            <h2>Get a Pet</h2>
        </div>
        <ul>
            <li>
                <Link to='/'>Adopt</Link>
            </li>
            {authenticated ? (
            <>
            <li>
                <Link to='/pet/myadoptions'>My Adoptions</Link>
            </li>
            <li>
                <Link to='/pet/mypets'>My Pets</Link>
            </li>
            <li>
                <Link to='/user/profile'>Profile</Link>
            </li>
            <li onClick={logout}>Logout</li>
                </>
            ) : (
               <> 
            <li>
                <Link to='/login'>Login</Link>
            </li>
            <li>
                <Link to='/Register'>Register</Link>
            </li>
            </>
            )}
            
        </ul>
       </nav>
    )
}

export default Navbar