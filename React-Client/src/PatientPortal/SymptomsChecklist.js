// react
import React, { useState } from 'react';

// import axios
import axios from 'axios';

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function SymptomsChecklist(props) {
    const apiUrl = 'http://localhost:5000/predict';
    const [showLoading, setShowLoading] = useState(false);
    const [result, setResult] = useState(null);
    // const [prognosis, setPrognosis] = useState(null);
    const symptomTypes = [
        { type: 'Pain in lower abdomen' },
        { type: 'Pain in middle abdomen' },
        { type: 'Pain in upper abdomen' },
        { type: 'Dry cough' },
        { type: 'Wet cough' },
        { type: 'Headache on one side of head' },
        { type: 'Headache on both sides of head' },
        { type: 'Problem with one eye' },
        { type: 'Problem with both eyes' },
        { type: 'Severe chest pain' },
        { type: 'Squeezing chest pain' },
        { type: 'Burning chest pain' },
        { type: 'Sharp chest pain' },
        { type: 'Nasal congestion' },
        { type: 'Sore throat' },
    ];

    // user's symptoms input
    const [symptoms, setSymptoms] = useState({
        'Pain in lower abdomen': 0,
        'Pain in middle abdomen': 0,
        'Pain in upper abdomen': 0,
        'Dry cough': 0,
        'Wet cough': 0,
        'Headache on one side of head': 0,
        'Headache on both sides of head': 0,
        'Problem with one eye': 0,
        'Problem with both eyes': 0,
        'Severe chest pain': 0,
        'Squeezing chest pain': 0,
        'Burning chest pain': 0,
        'Sharp chest pain': 0,
        'Nasal congestion': 0,
        'Sore throat': 0
    });

    // handle checkbox toggle
    const onReqChange = (e) => {
        e.persist();
        console.log(`name: ${e.target.name}, checked: ${e.target.checked == true ? 1 : 0}`);
        setSymptoms({ ...symptoms, [e.target.name]: e.target.checked == true ? 1 : 0 });
    };

    // on form submit, predict prognosis
    const predict = e => {
            setResult(null);
            setShowLoading(true);
            e.preventDefault();
            // data = symptoms
            console.log(`these are symptoms before posting: `, JSON.stringify(symptoms));
            axios.post(apiUrl, symptoms, { withCredentials: true, credentials: 'include' })
                .then((result) => {
                        setResult(result.data.prognosis);
                        setShowLoading(false);
                })
                .catch((error) => {setShowLoading(false)});
    };

    return (
        <Container>
            <Form className='mt-3' onSubmit={predict}>
                <h3>Symptoms Checklist</h3>

                <Form.Label>
                    Please select the symptoms you are experiencing from the
                    checklist below
                </Form.Label>
                {symptomTypes.map((item) => (
                    <Form.Check
                        type='checkbox'
                        label={item.type}
                        name={item.type}
                        onChange={onReqChange}
                    />
                ))}

                <Button variant='info' type='submit' className='mt-3'>
                    Predict Prognosis
                </Button>
            </Form>

                {showLoading === true && (
                    <div>
                        <h1></h1>
                        <Spinner animation='border' role='status'>
                            <span className='sr-only'>Loading...</span>
                        </Spinner>
                        <h4>One moment please...</h4>
                    </div>
                )}

                {result === null ? (
                    <div></div>
                ) : (
                    <div>
                        {result === "INVALID" ? (
                            <div>Please try again</div>
                        ) : (
                            <h4 className='mt-3'>
                                We predict you are experiencing: <span className='text-info'>{result}</span>
                                <br /> 
                                Please consult a medical professional.
                            </h4>
                        )}
                    </div>
                )}
        </Container>
    );
}

export default SymptomsChecklist;
