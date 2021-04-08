// react
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    withRouter,
} from 'react-router-dom';

// import axios
import axios from 'axios';

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';

// import any of our components you may need:
import DailyInformationForm from './DailyInformationForm';
import EmergencyAlertForm from './EmergencyAlertForm';
import MotivationalTipsList from './MotivationalTipsList';
import MotivationalVideo from './MotivationalVideo';
import SymptomsChecklist from './SymptomsChecklist';

function PatientPortalHome(props) {
    const apiUrl = 'http://localhost:5000/api/patient/sign-out';
    const apiUrl2 = 'http://localhost:5000/api/patient/read-cookie';
    const [auth, setAuth] = useState(false);
    const [patient, setPatient] = useState('');

    const signOutPatient = async () => {
        try {
            var res = await axios.get(apiUrl, {
                withCredentials: true,
                credentials: 'include',
            });
            if (res.data.message) props.history.push('/clinic/home/');
        } catch (e) {
            console.log(e);
        }
    };

    // check if the patient is already signed in
    const readCookie = async () => {
        try {
            const res = await axios.get(apiUrl2, {
                withCredentials: true,
                credentials: 'include',
            });
            console.log(res.data);
            if (res.data.authorized === true) {
                setAuth(true);
            } else {
                props.history.push('/clinic/sign-in');
            }
            setPatient(res.data.patient.payload.id);
            console.log('current patient is: '+ patient);
            
        } catch (e) {
            props.history.push('/clinic/sign-in');
        }
    };
    // runs the first time the view is rendered
    // to check if a patient is signed in
    useEffect(() => {
        readCookie();
    }, []);

    return (
        <Container>
            {auth === true && (
                <div>
                    <h1 className='display-4 text-center mt-3'>
                        Patient Portal
                    </h1>
                    <div style={{ display: 'flex' }}>
                        <Button
                            style={{ marginLeft: 'auto' }}
                            variant='info'
                            onClick={signOutPatient}>
                            Sign Out
                        </Button>
                    </div>

                    <Tabs
                        defaultActiveKey='dailyInfo'
                        id='uncontrolled-tab-example'>
                        <Tab
                            eventKey='dailyInfo'
                            title='Daily Information Form'>
                        </Tab>
                        <Tab
                            eventKey='alert'
                            title='Emergency Alert Form'>
                                    <EmergencyAlertForm />
                        </Tab>
                        <Tab
                            eventKey='mList'
                            title='Motivational Tips List'>
                                <MotivationalTipsList />
                        </Tab>
                        <Tab eventKey='mVideo' title='Motivational Video'>
                                <MotivationalVideo />
                        </Tab>
                        <Tab
                            eventKey='checklist'
                            title='Symptoms Checklist'>
                        </Tab>
                    </Tabs>
                </div>
            )}
        </Container>
    );
}

export default withRouter(PatientPortalHome);
