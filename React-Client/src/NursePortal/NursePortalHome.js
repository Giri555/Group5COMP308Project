// react
import React, { useState, useEffect } from 'react';
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
import EmergencyAlertsList from './EmergencyAlertsList';
import MotivationalTipForm from './MotivationalTipForm';
import MotivationalTipList from './MotivationalTipsList';
import NurseList from './NurseList';
import PatientList from './PatientList';
import RequiredVitalSigns from './RequiredVitalSigns';
import VitalSignsForm from './VitalSignsForm';
import VitalSignsList from './VitalSignsList';

function NursePortalHome(props) {
    const apiUrl = 'http://localhost:5000/api/nurse/sign-out';
    const apiUrl2 = 'http://localhost:5000/api/nurse/read-cookie';
    const [auth, setAuth] = useState(false);
    const signOutNurse = async () => {
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

    // check if the nurse is already signed in
    const readCookie = async () => {
        try {
            const res = await axios.get(apiUrl2, {
                withCredentials: true,
                credentials: 'include',
            });
            if (res.data.authorized === true) {
                setAuth(true);
            } else {
                props.history.push('/clinic/sign-in');
            }
        } catch (e) {
            props.history.push('/clinic/sign-in');
        }
    };
    // runs the first time the view is rendered
    // to check if a nurse is signed in
    useEffect(() => {
        readCookie();
    }, []);

    return (
        <Container>
            {auth === true && (
                <div>
                    <h1 className='display-4 text-center mt-3'>Nurse Portal</h1>
                    <div style={{ display: 'flex' }}>
                        <Button
                            style={{ marginLeft: 'auto' }}
                            variant='info'
                            onClick={signOutNurse}>
                            Sign Out
                        </Button>
                    </div>
                    <Tabs
                        defaultActiveKey='alerts'
                        id='uncontrolled-tab-example'>
                        <Tab eventKey='alerts' title='Emergency Alerts List'>
                            {/* component here */}
                        </Tab>
                        <Tab
                            eventKey='mForm'
                            title='Motivational Tip Form'></Tab>
                        <Tab
                            eventKey='mList'
                            title='Motivational Tips List'></Tab>
                        <Tab eventKey='nList' title='Nurse List'></Tab>
                        <Tab eventKey='pList' title='Patient List'></Tab>
                        <Tab eventKey='reqV' title='Required Vital Signs'></Tab>
                        <Tab eventKey='vsForm' title='Vital Signs Form'></Tab>
                        <Tab eventKey='vsList' title='Vital Signs List'></Tab>
                    </Tabs>
                </div>
            )}
        </Container>
    );
}

export default withRouter(NursePortalHome);
