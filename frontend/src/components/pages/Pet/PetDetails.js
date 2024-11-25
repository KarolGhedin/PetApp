import api from "../../../utils/api"
import styles from "./PetDetails.module.css"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import useFlashMessage from "../../../hooks/useFlashMessage"




function PetDetails() {
    const [pet, setPet] = useState({})
    const {id} = useParams()
    const {setFlashMessage} = useFlashMessage()
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        api.get(`/pets/${id}`).then((response) => {
            setPet(response.data.pet)
        })
    }, [id])

    async function schedule() {
        
        let msgType = 'success'
        const data = await api.patch(`pets/schedule/${pet._id}`, {
            Authorization : `Bearer ${JSON.parse(token)}`
        }).then((response) => {
            return response.data
        }).catch((err) => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    return (
        <>
        {pet.name && (
            <section className={styles.pet_details_container}>
                <div className={styles.pet_details_header}>
                    <h1>Get to know {pet.name}</h1>
                    <p>If you get interested, make an appointment to visit and meet the pet</p>
                </div>
                <div className={styles.pet_images}>
                    {pet.images.map((image, index) => (
                        <img
                        src={`${process.env.REACT_APP_API}/images/pets/${image}`}
                        alt={pet.name}
                        width="px75"
                        key={index}
                        />
                    ))}
                </div>
                <p>
                    <span className="bold">Weight:</span> {pet.weight} kg
                </p>
                <p>
                    <span className="bold">Age</span> {pet.age} years
                </p>
                {token ? (
                    <button onClick={schedule}>Make an appointment</button>
                ) : (
                   <p>You need to <Link to="/register">create an account</Link> to make a visit</p> 
                )}
            </section>
        )}
        </>
    )
}

export default PetDetails