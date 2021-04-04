// react
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';

// import axios
import axios from "axios";

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function SendTip(props){

    // Step 1 -- Set up the patient list:
    const apiUrl_patientList = 'http://localhost:5000/api/nurse/listPatients';
    const [error, setError] = useState(true);
    const [patientList, setPatientList] = useState([]); // array of patients
    const [patient, setPatient] = useState(''); // the selected patient's id

    // initialize the select with list of patients
    const getPatientList = async () => {
        try {
            const res = await axios.get(apiUrl_patientList, {
                withCredentials: true,
                credentials: 'include',
            });
            if (res.data) {
                console.log(`this is the list of patients`, res.data);
                setPatientList(res.data);
            } else {
                console.log(`patient list not received`);
            }
        } catch (e) {
            console.log(`reached catch from init`);
        }
    };

    // load the patient list the first time the view is rendered + the tip list as well
    useEffect(() => {
        getPatientList();
    },[]);

    

    // get the selected patient:
    const onChange_setSelectedPatient = (e) => {
        e.persist();
        console.log(`the selected patient id is: ${e.target.value}`);
        setPatient(e.target.value);
        getTipList(); // update the list of tips when select a patient.
    };

    // step 2 - set up the motivational tip list
    const apiUrl_tipList = `http://localhost:5000/api/nurse/motivationalTips`;
    const [tipList, setTipList] = useState([]);
    const [tip, setTip] = useState(''); // the selected tip's id

    // initialize the select with list of patients
    const getTipList = async () => {
        try {
            const res = await axios.get(apiUrl_tipList, {withCredentials: true,credentials: 'include'});
            if (res.data) {
                console.log(`this is the list of tips`, res.data);
                setTipList(res.data);
            } else {
                console.log(`tip list not received`);
            }
        } catch (e) {
            console.log(`reached catch from getTipList`);
        }
    };

    // get the selected tip:
    const onChange_setSelectedTip = (e) => {
        e.persist();
        console.log(`the selected tip id is: ${e.target.value}`);
        setTip(e.target.value);
    };

    // step 3 - send the selected tip to the selected patient
    const sendTip = e => {
            const apiUrl_sendTip = `http://localhost:5000/api/nurse/motivationalTips/${tip}/${patient}`; // put
            e.preventDefault();
            console.log(`url: ${apiUrl_sendTip}`);
            axios.put(apiUrl_sendTip, { withCredentials: true, credentials: 'include' })
                .then((result) => {
                        if(result.data.patient){
                                console.log(`result of send tip patient: ${result.data.patient}`);
                                setError(false);
                        }
                        else{
                                setError(true);
                        }
                })
                .catch((error) => {
                        console.log(`reached error in sendTip catch`);
                        setError(true);
                });
    };


        return (
                <Container className='mt-1'>
                <Form className='mt-3' onSubmit={sendTip}>
                <h3>Send Motivational Tip to Patient</h3>

                <Form.Group>
                    <Form.Label>Step 1 - Select the patient</Form.Label>
                    <Form.Control as='select' custom onChange={onChange_setSelectedPatient} required>
                            <option> Please select a patient from this list...</option>
                            {patientList.map((patient, index) => {
                                return (
                                    <option key={index} value={patient._id}>
                                        Full Name: {patient.fullName} Email:{' '}
                                        {patient.email}
                                    </option>
                                );
                            })}
                    </Form.Control>
                    </Form.Group>

                    <Form.Group>
                    <Form.Label>Step 2 - Select the tip you would like to send to patient</Form.Label>
                    <Form.Control as='select' custom onChange={onChange_setSelectedTip} required>
                            <option> Please select a tip from this list...</option>
                            {tipList.map((tip, index) => {
                                return (
                                    <option key={index} value={tip._id}>
                                        Title: {tip.title} Content: {tip.content}
                                    </option>
                                );
                            })}
                    </Form.Control>
                    </Form.Group>

                    
                    <Button variant='info' type='submit'>
                        Send Tip
                    </Button>
                </Form>
                {error === false && (
                <Alert variant='success' className='mt-3'>
                    Motivational tip has been sent.
                </Alert>
            )}
            </Container>
        );
};

export default SendTip;
