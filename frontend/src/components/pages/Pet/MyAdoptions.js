import api from "../../../utils/api"
import { useState, useEffect } from "react"
import styles from "./Dashboard.module.css"
import RoundedImage from "../../layoult/RoundedImage"

function MyAdoptions() {
    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        api.get('/pets/myadoptions', {
            headers: {
                Authorization : `Bearer ${JSON.parse(token)}`,
            }
        }).then((response) => {
            setPets(response.data.pets)
        })
    }, [token])

 return (
    <section>
        <div className={styles.petlist_header}>
            <h1>My Adoptons</h1>
        </div>
        <div className={styles.petlist_container} key={pets.name}>
            {pets.length > 0 &&
            pets.map((pet) => (
                <div className={styles.petlist_row} key={pet._id}>
                        <RoundedImage
                        src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`}
                        alt={pet.name}
                        width="px75"
                        />
                        <span className="bold">{pet.name}</span>
                        <div className={styles.contacts}>
                            <p>
                                <span className="bold">Call this numer: </span>{pet.user.phone}
                            </p>
                            <p>
                                <span className="bold">And talk to: </span>{pet.user.name}
                            </p>
                        </div>
                        <div className={styles.actions}>
                            {pet.available ? (
                                <p>Adoptions in process</p>
                                ) : (
                                <p>Congratulations! The adoption is concluded!</p>
                            )}
                        </div>
                    </div>
            ))
            }
            {pets.length === 0 && <p>You still don't have any Pet adoptions</p>}
        </div>
    </section>
 )   
}

export default MyAdoptions