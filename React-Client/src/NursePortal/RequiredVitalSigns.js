// react
import React, { useState, useEffect } from 'react';

// import axios
import axios from 'axios';

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function RequiredVitalSigns() {
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

    // Step 2 -- get the vital signs requirments specified by nurse using checkboxes

    // mapping data for the vital signs checkboxes
    const vitalSignsTypes = [
        { name: 'Body Temperature', propName: 'bodyTemperature' },
        { name: 'Heart Rate', propName: 'heartRate' },
        { name: 'Blood Pressure', propName: 'bloodPressure' },
        { name: 'Respiratory Rate', propName: 'respiratoryRate' },
        { name: 'Pulse Rate', propName: 'pulseRate' },
        { name: 'Weight', propName: 'weight' },
    ];

    // vital signs
    const [requirements, setRequirements] = useState({
        bodyTemperature: false,
        heartRate: false,
        bloodPressure: false,
        respiratoryRate: false,
        pulseRate: false,
        weight: false,
    });

    // handle checkbox toggle
    const onReqChange = (e) => {
        e.persist();
        console.log(`name: ${e.target.name}, checked: ${e.target.checked}`);
        setRequirements({ ...requirements, [e.target.name]: e.target.checked });
    };

    // get the selected patient:
    const onChange_setSelectedPatient = (e) => {
        e.persist();
        console.log(`the selected patient id is: ${e.target.value}`);
        setPatient(e.target.value);
    };

    // update the required vital signs:
    const submitRequirements = (e) => {
        const apiUrl_updatePatientReqs = `http://localhost:5000/api/vital-signs/update-patient-requirements/${patient}`;
        e.preventDefault();
        console.log(JSON.stringify(requirements));
        axios
            .put(
                apiUrl_updatePatientReqs,
                { requirements: requirements },
                { withCredentials: true, credentials: 'include' }
            )
            .then((result) => {
                if (result.data.data !== null) {
                    setError(false);
                } else {
                    setError(true);
                }
            })
            .catch((error) => {
                console.log(`reached error in submitRequirements catch`);
                setError(true);
            });
    };

    return (
        <Container className='mt-5'>
            <Form onSubmit={submitRequirements}>
                <h3>Required Vital Signs Form</h3>
                <Form.Group>
                    <Form.Label>Step 1 - Select the patient</Form.Label>
                    <Form.Control
                        as='select'
                        custom
                        onChange={onChange_setSelectedPatient}
                        required>
                        <option>
                            Please select a patient from this list...
                        </option>
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

                <Form.Label>
                    Step 2 - Select the required vital signs for the patient:
                </Form.Label>
                {vitalSignsTypes.map((type) => (
                    <Form.Check
                        type='checkbox'
                        label={type.name}
                        name={type.propName}
                        onChange={onReqChange}
                    />
                ))}

                <Button variant='info' type='submit'>
                    Submit Required Vital Signs
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

export default RequiredVitalSigns;
