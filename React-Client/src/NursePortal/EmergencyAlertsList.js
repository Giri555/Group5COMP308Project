import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

function EmergencyAlertsList(props) {
    const [data, setData] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const apiUrl = 'http://localhost:5000/api/nurse/emergencyAlerts';

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(apiUrl,{withCredentials: true, credentials: 'include'});
            setData(result.data);
            setShowLoading(false);
        };
        fetchData();
    }, []);

    const deleteAlert = (id) => {
        setShowLoading(true);
        const alert = { title: data.title};
        //
        axios.delete(`http://localhost:5000/api/nurse/${id}`, alert)
          .then((result) => {
            setShowLoading(false);
            props.history.push('/clinic/nurse/portal')
            window.location.reload();
          }).catch((error) => setShowLoading(false));
    };
  
    return (
        <div>
            {showLoading && (
                <Spinner animation='border' role='status'>
                    <span className='sr-only'>Loading...</span>
                </Spinner>
            )}
            <ListGroup>
                {data.map((emergencyAlert, idx) => (
                    <ListGroup.Item
                        key={idx}
                        action>
                            EMERGENCY: {emergencyAlert.title}<br />
                            Patient: {emergencyAlert.creator.firstName} {emergencyAlert.creator.lastName} <br />
                            First Responders: {emergencyAlert.emergencyContacts} <br />
                            Date: {emergencyAlert.dateTime}
                        <Button type='button' variant='danger' onClick={() => {deleteAlert(emergencyAlert._id)}} style={{display: 'flex'}}>
                            Delete
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default withRouter(EmergencyAlertsList);
