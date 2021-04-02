import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';

function EmergencyAlertsList(props) {
    const [data, setData] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const apiUrl = 'http://localhost:5000/api/nurse/listAlerts';

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
                            {emergencyAlert.title} {emergencyAlert.dateTime} {emergencyAlert.creator.firstName} {emergencyAlert.creator.lastName} {emergencyAlert.emergencyContacts}
                            {emergencyAlert.firstName}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default withRouter(EmergencyAlertsList);
