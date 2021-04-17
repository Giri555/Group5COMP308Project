// react
import React, { useState, useEffect } from 'react';

// import axios
import axios from 'axios';

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function VitalSignsForm() {
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

    // load the patient list the first time the view is rendered
    useEffect(() => {
        getPatientList();
    }, []);

    // get the selected patient:
    const onChange_setSelectedPatient = (e) => {
        e.persist();
        console.log(`the selected patient id is: ${e.target.value}`);
        setPatient(e.target.value);
    };

    // Step 2 - Process the form input
    const [vitalSigns, setVitalsSigns] = useState({
        // _id: '',
        bodyTemperature: '',
        heartRate: '',
        bloodPressure: '',
        respiratoryRate: '',
        pulseRate: '',
        weight: '',
    });
    const onChange = (e) => {
        e.persist();
        setVitalsSigns({ ...vitalSigns, [e.target.name]: e.target.value });
    };
    const submit = e =>{
            e.preventDefault();
            const apiUrl_createVitalSigns = `http://localhost:5000/api/vital-signs/nurse/${patient}`;
            console.log(JSON.stringify(vitalSigns));
            axios.post(apiUrl_createVitalSigns, vitalSigns, { withCredentials: true, credentials: 'include' })
                .then((result) => {
                        if(result.data.data !== null){
                                setError(false);
                        }
                        else{
                                setError(true);
                        }
                })
                .catch((error) => {setError(true);});
    };

    return (
        <Container className='mt-1'>
            <Form className='mt-3' onSubmit={submit}>
            <h3>Vital Signs Form</h3>
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
                <Form.Label>Step 2 - Record the patient's vital signs</Form.Label>
                <Form.Group>
                    <Form.Label>Body Temperature</Form.Label>
                    <Form.Control onChange={onChange} name='bodyTemperature' value={vitalSigns.bodyTemperature} type='text'/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Heart Rate</Form.Label>
                    <Form.Control onChange={onChange} name='heartRate' value={vitalSigns.heartRate} type='text'/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Blood Pressure</Form.Label>
                    <Form.Control onChange={onChange} name='bloodPressure' value={vitalSigns.bloodPressure} type='text'/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Respiratory Rate</Form.Label>
                    <Form.Control onChange={onChange} name='respiratoryRate' value={vitalSigns.respiratoryRate} type='text'/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Pulse Rate</Form.Label>
                    <Form.Control onChange={onChange} name='pulseRate' value={vitalSigns.pulseRate} type='text'/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Weight</Form.Label>
                    <Form.Control onChange={onChange} name='weight' value={vitalSigns.weight} type='text'/>
                </Form.Group>
                <Button variant='info' type='submit'>
                    Record Vital Signs
                </Button>
            </Form>
            {error === false && (
                <Alert variant='success' className='mt-3'>
                    Required Vital Signs submitted for patient successfully.
                </Alert>
            )}
        </Container>
    );
}

export default VitalSignsForm;
