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
        return <h3 class="text-danger">Ошибка: {error.message}</h3>;
    } else if (!isLoaded) {
        return <h3 class="text-info">Загружаю...</h3>;
    } else {
        return (
            <div>
                <div class="page-header mt-2">
                    <h1>
                        Жду Посылку! <small>Сервис отслеживания отправлений.</small>
                    </h1>
                </div>
                <label for="exampleInputEmail1">
                    Номер отправления
                </label>
                <input placeholder="Формата AA000000000RU или 12345678901234" type="text" class="form-control mt-2"
                    value = {barcode} onChange = {event => setBarcode(event.target.value.toUpperCase())}/>
                <button type="button" class="btn btn-primary btn-lg btn-block mt-2" onClick = {handleClick}>
                    Добавить в список
                </button>
                {parcels.map(parcel => (
                    <div>
                        <Link to={`parcel/${parcel.pk}`}><h3 class="text-center text-info mt-2">{parcel.fields.track_code}</h3></Link>
                    </div>
                ))}
            </div>
        );
    }

}
export default Home;