import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [parcels, setParcels] = useState([]);
    const [barcode, setBarcode] = useState("");

    const handleClick = async() => {
        if (barcode.match(/^\w{2}\d{9}\w{2}$|^\d{14}$/)) {
            setIsLoaded(false);
            const requestOptions = {
                method: 'POST',
                headers: { 'AuthToken': localStorage.getItem("z3r0token") }
            };
            fetch('http://127.0.0.1:8000/api/parcel?code=' + barcode, requestOptions)
                .then(res => res.json())
                .then(
                    (data) => {
                        window.location.reload();
                    },
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
        } else {
            alert("Некорректный номер отслеживания!")
        }
    }

    useEffect(() => {
        if (localStorage.getItem("z3r0token") === null) {
            const requestOptions = {
                method: 'POST'
            };
            fetch('http://127.0.0.1:8000/api/new_token', requestOptions)
            .then(res => res.json())
                .then(
                    (data) => {
                        localStorage.setItem('z3r0token', data.token);
                    },
                    (error) => {
                        setError(error);
                    }
                )
        }
        const requestOptions = {
            method: 'GET',
            headers: { 'AuthToken': localStorage.getItem("z3r0token") }
        };
        fetch('http://127.0.0.1:8000/api/parcel', requestOptions)
            .then(res => res.json())
            .then(
                (data) => {
                    setParcels(data.parcels);
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <input placeholder = {"Формата AA000000000RU или 12345678901234"} type="text" value = {barcode} onChange = {event => setBarcode(event.target.value.toUpperCase())}/>
                <button onClick= {handleClick}>Добавить</button>
            <div>
                {parcels.map(parcel => (
                    <div>
                        <Link to={`parcel/${parcel.pk}`}>{parcel.fields.track_code}</Link>
                    </div>
                ))}
            </div>
            </div>
        );
    }

}
export default Home;