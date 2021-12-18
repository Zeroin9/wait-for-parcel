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
        return <div>Error: {error.message}</div>;
    }
    if (!isLoaded) {
        return <div>Loading...</div>;
    }  
    
    if (parcel) {
        return (
            <div>
                <div>
                    <Link to={`/`}>Назад</Link>
                </div>
                <div>
                    <h1>{parcelFields.track_code}</h1>
                    <div>
                        {opers.map(oper => (
                            <div>
                                {oper.fields.postOfficeIndex},  {oper.fields.postOfficeName}:  {oper.fields.name} -  {Moment(oper.fields.date).format('d.MM.yyyy')}
                            </div>
                        ))}
                    </div>
                    <button onClick = {handleClick}>Обновить</button>
                </div>
            </div>
        );
    }
}
export default Parcel;