// react
import React, { useState, useEffect } from 'react';

// import axios
import axios from 'axios';

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function DailyInformationForm(props) {
    // Step 1 -- Set up the patient list:
    const apiUrl = 'http://localhost:5000/api/daily-info/patient/:patientId';
    const apiUrl_patient = 'http://localhost:5000/api/patient/read-cookie';
    const [error, setError] = useState(true);
    const [patient, setPatient] = useState(''); // the selected patient's id
    const [button, setButton] = useState(false);
 
  // requirements to filter
    const [requirements, setRequirements] = useState({
      bodyTemperature: false,
      heartRate: false,
      bloodPressure: false,
      respiratoryRate: false,
      pulseRate: false,
      weight: false,
    });
    // vital sign information to save
    const [vitalSigns, setVitalsSigns] = useState({
      bodyTemperature: '',
      heartRate: '',
      bloodPressure: '',
      respiratoryRate: '',
      pulseRate: '',
      weight: '',
    });
    // to reference and map
    const vitalSignsTypes = [
      { name: 'Body Temperature', propName: 'bodyTemperature' },
      { name: 'Heart Rate', propName: 'heartRate' },
      { name: 'Blood Pressure', propName: 'bloodPressure' },
      { name: 'Respiratory Rate', propName: 'respiratoryRate' },
      { name: 'Pulse Rate', propName: 'pulseRate' },
      { name: 'Weight', propName: 'weight' },
    ];

    const onChange = (e) => {
      e.persist();
      setButton(true);
      setVitalsSigns({ ...vitalSigns, [e.target.name]: e.target.value });
    };

  // get the currently logged in patient
  const getPatient = async () => {
    try {
      const res = await axios.get(apiUrl_patient, {
        withCredentials: true,
        credentials: 'include',
      });
      if (res.data) {
        console.log(`this is the received patient `, res.data);
        console.log('Patient ID: ', res.data.patient.payload.id);
        setPatient(res.data.patient.payload.id);
        const res2 = await axios.get(`http://localhost:5000/api/patients/${res.data.patient.payload.id}`, {
          withCredentials: true,
          credentials: 'include',
        });
        if (res2.data) {
          setRequirements(res2.data.requirements);
          // console.log("PATIENT REQUIREMENTS FROM res2.data: ", res2.data.requirements);
          // console.log("PATIENT REQUIREMENTS AFTER SET: ", requirements);
          // console.log('Value of requirements[bodyTemperature]', requirements['bodyTemperature'])
        }
        else {
          console.log('patient data not received');
        }
      } 
      else {
        console.log(`patient not received`);
      }
    } catch (e) {
      console.log(`reached catch from init`);
    }
  };

  useEffect(() => {
    getPatient();
   }, []);

  const submit = e => {
    e.preventDefault();
    const apiUrl_createVitalSigns = `http://localhost:5000/api/vital-signs/nurse/${patient}`;
    console.log(JSON.stringify(vitalSigns));
    axios.post(apiUrl_createVitalSigns, vitalSigns, { withCredentials: true, credentials: 'include' })
      .then((result) => {
        if (result.data.data !== null) {
          setError(false);
        }
        else {
          setError(true);
        }
      })
      .catch((error) => { setError(true); });
  };

  return (
    <Container className='mt-1'>
      <Form className='mt-3' onSubmit={submit}>
        <h3>Daily Information Form</h3>
        <Form.Label>Enter specified information</Form.Label>
        {vitalSignsTypes.map((type) => {
          if (requirements[type.propName]) {
            return (
              <Form.Group>
                <Form.Label>{type.name}</Form.Label>
                <Form.Control
                  type='text'
                  name={type.propName}
                  required
                  onChange={onChange}
                />
              </Form.Group>
            )
          }
        })}
      {button === true && (
        <Button variant='info' type='submit'>
        Submit
      </Button>
      )}
      </Form>
      {error === false && (
        <Alert variant='success' className='mt-3'>
          Successfully entered.
        </Alert>
      )}
    </Container>
  );
}

export default DailyInformationForm;
