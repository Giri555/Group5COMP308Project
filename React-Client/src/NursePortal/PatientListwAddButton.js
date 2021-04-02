import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';

function PatientListwAddButton(props) {
    console.log('props is: '+props.match.params.motivationalTipId);
    const [data, setData] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [error, setError] = useState('');
    const apiUrl = 'http://localhost:5000/api/nurse/listPatients';
    const sendToPatientUrl='http://localhost:5000/api/nurse/motivationalTips/'+props.match.params.motivationalTipId+'/';

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(apiUrl, {withCredentials: true, credentials: 'include'});
            setData(result.data);
            setShowLoading(false);
        };

        fetchData();
    }, []);

    const sendToPatient=(id)=>{
        setShowLoading(true);
        const tip = { title: data.title, content: data.content };
        
        axios.put(sendToPatientUrl+id, tip,{withCredentials: true, credentials: 'include'} )
          .then((result) => {
            setShowLoading(false);
           
              props.history.push('/listTips');
                
          }).catch((error) => {
            setError(error);
            setShowLoading(false);
          });
          console.log(tip);
    }
    return (
        <div>
            {showLoading && (
                <Spinner animation='border' role='status'>
                    <span className='sr-only'>Loading...</span>
                </Spinner>
            )}
            <ListGroup>
                {data.map((patient, idx) => (
                    <ListGroup.Item
                        key={idx}
                        action
                        onClick={() => { sendToPatient(patient._id) }}>
                            ({patient.firstName})
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default withRouter(PatientListwAddButton);
