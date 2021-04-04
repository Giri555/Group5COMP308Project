// react
import React, { useState, useEffect } from 'react';

// import axios
import axios from 'axios';

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

function VitalSignsList() {
    // Step 1 -- Set up the patient list:
    const apiUrl_patientList = 'http://localhost:5000/api/nurse/listPatients';
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
            console.log(`reached catch from getPatientList`);
        }
    };

    // load the patient list the first time the view is rendered
    useEffect(() => {
        getPatientList();
    }, []);

    // get the selected patient:
    const onChange_setSelectedPatient = (e) => {
        e.persist();
        setPatient(e.target.value);
        submit(e.target.value);
    };

    // step 2:
    const [vsList, setList] = useState([]); // array of vital signs object ids
    const [vitalSignsData, setVitalSignsData] = useState([]); // array of vital signs docs
    let vitalSignsArray = [];

    const submit = async (value) => {
        //     e.preventDefault();
        console.log(`FROM ASYNC - patient is: ${value}`);
            const apiUrl_getList = `http://localhost:5000/api/vital-signs/nurse/${value}`;
            const apiUrl_getOne = `http://localhost:5000/api/vital-signs/nurse/${value}/`;
            try {
                const result = await axios.get(apiUrl_getList, {withCredentials: true, credentials: 'include'});
                if(result.data.vitalSignsList){
                        setList(result.data.vitalSignsList);
                        for(let i = 0; i < result.data.vitalSignsList.length; i++){
                                const doc = await axios.get(apiUrl_getOne + result.data.vitalSignsList[i], {withCredentials: true, credentials: 'include'});
                                vitalSignsArray.push(doc.data.data.vitalSigns);
                        }
                        setVitalSignsData(vitalSignsArray);
                }
                else{
                        console.log(`vital signs list not received`);
                }
            } catch (e) {console.log(`reached catch from submit`);}
    };

    return (
        <Container className='mt-1'>
            <Form className='mt-3' >
                <h3>Vital Signs List</h3>

                <Form.Group>
                    <Form.Label>Select a patient to access information captured during previous clinical visits:</Form.Label>
                    <Form.Control as='select' custom onChange={onChange_setSelectedPatient}>
                        <option>Please select a patient from this list...</option>
                        {patientList.map((patient, index) => {
                            return (
                                <option key={index} value={patient._id}>Full Name: {patient.fullName} Email: {patient.email}</option>
                            );
                        })}
                    </Form.Control>
                </Form.Group>

                <ListGroup>
                        {vitalSignsData.map((vs, idx) => (
                        <ListGroup.Item key={idx}>
                                Body Temperature: {vs.bodyTemperature}
                                <br/>
                                Heart Rate: {vs.heartRate}
                                <br/>
                                Blood Pressure: {vs.bloodPressure}
                                <br/>
                                Respiratory Rate: {vs.respiratoryRate}
                                <br/>
                                Pulse Rate: {vs.pulseRate}
                                <br/>
                                Weight: {vs.weight}
                        </ListGroup.Item>
                        ))}
                </ListGroup>
            </Form>
        </Container>
    );
}

export default VitalSignsList;
