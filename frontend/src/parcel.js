import React, { useState, useEffect}  from 'react';
import { useParams, Link } from "react-router-dom";
import Moment from 'moment';

const Parcel = () => {
    const params = useParams();
    const parcelId = params.id;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [parcel, setParcel] = useState([]);
    const [parcelFields, setParcelFields] = useState([]);
    const [opers, setOpers] = useState([]);

    const handleClick = async() => {
        setIsLoaded(false);
        const requestOptions = {
            method: 'POST'
        };
        fetch('http://127.0.0.1:8000/api/refresh?parcel_pk=' + parcelId, requestOptions)
            .then(res => res.json())
            .then(
                (data) => {
                    if (data.error) {
                        setError({message:"Неправильный трек-номер!"});
                    } else {
                        setParcel(data.parcel);
                        setParcelFields(data.parcel.fields);
                        setOpers(data.operations);
                        setIsLoaded(true);
                    }
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }
    
    useEffect(() => {
        const requestOptions = {
            method: 'GET'
        };
        fetch('http://127.0.0.1:8000/api/operations?parcel_pk=' + parcelId, requestOptions)
            .then(res => res.json())
            .then(
                (data) => {
                    setParcel(data.parcel);
                    setParcelFields(data.parcel.fields);
                    setOpers(data.operations);
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    if (error) {
        return (
            <div>
                <h3 class="text-danger">Ошибка: {error.message}</h3>
                <a href={"/parcel/" + parcelId} class="btn btn-info mt-2" role="button" aria-pressed="true">
                    Назад
                </a>
            </div>
        
        );
    }
    if (!isLoaded) {
        return <h3 class="text-info">Загружаю...</h3>;
    }  
    
    if (parcel) {
        return (
            <div>
                <div class="page-header mt-2">
                    <h1>
                        {parcelFields.track_code}
                    </h1>
                </div>
                <div class="list-group mt-2">
                    {opers.map(oper => (
                            <div class="list-group-item mt-2">
                                <a href={"https://www.pochta.ru/offices/" + oper.fields.postOfficeIndex}>{oper.fields.postOfficeIndex}, {oper.fields.postOfficeName}</a>: {oper.fields.name} - {Moment(oper.fields.date).format('d.MM.yyyy')}
                            </div>
                    ))}
                </div> 
                <button type="button" class="btn btn-lg btn-info float-right mt-2" onClick = {handleClick}>
                    Обновить
                </button>
            </div>
        );
    }
}
export default Parcel;