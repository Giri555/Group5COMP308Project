import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';

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
                            Patient: {emergencyAlert.creator} <br />
                            First Responders: {emergencyAlert.emergencyContacts} <br />
                            Date: {emergencyAlert.dateTime}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default withRouter(EmergencyAlertsList);
