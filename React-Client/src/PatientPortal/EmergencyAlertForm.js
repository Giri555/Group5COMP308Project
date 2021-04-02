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
import Spinner from 'react-bootstrap/Spinner';
import Jumbotron from 'react-bootstrap/Jumbotron';

function EmergencyAlertForm(props) {
  console.log('props.screen', props.screen);
  const email = props.screen;
  const apiUrl = 'http://localhost:5000/api/patient/emergencyAlerts';
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState({
    _id: '',
    title: '',
    emergencyContacts: '',
    email: ''
  });
  const [showLoading, setShowLoading] = useState(false);

  const onChange = (e) => {
    e.persist();
    setAlert({ ...alert, [e.target.name]: e.target.value });
  };
  const sendAlert = (e) => {
    setShowLoading(true);
    e.preventDefault();
    const alertData = {
      title: alert.title,
      emergencyContacts: alert.emergencyContacts,
      email: email
    };
    axios.post(apiUrl, alertData)
    .then((result) => { 
        setShowLoading(false);
        console.log(result.data);
        if (result.data.error === true) setError(true);
        else props.history.push('/clinic/patient/portal');
      }).catch((error) => {
        setError(true);
      });
  };

  return (
    <Container>
      <h1 className='display-4 mt-3 text-center'>Emergency Alerts</h1>
      <p className='text-muted text-center'>
        Create and send an emergency alerts. First responders will receive it and act effective immediately.
      </p>
      {showLoading &&
        <Spinner animation='boreder' role='status'>
          <span className="sr-only">Loading...</span>  
        </Spinner>
      }
      <Jumbotron>
        <Form className='mt-3' onSubmit={sendAlert}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              onChange={onChange}
              name='title'
              value={alert.title}
              type='text'
              placeholder='Enter the emergency alert'
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Emergency Contact</Form.Label>
            <Form.Control
              onChange={onChange}
              name='emergencyContacts'
              value={alert.emergencyContacts}
              type='text'
              placeholder="Enter the first responders' contact"
              required
            />
          </Form.Group>
          <Button variant='info' type='submit'>
            Send Alert
          </Button>
        </Form>
      </Jumbotron>
      
      {error === true && (
        <Alert variant='danger' className='mt-3'>
          Emergency alert failed to send. Please try again.
        </Alert>
      )}
    </Container>
  );
};


export default withRouter(EmergencyAlertForm); 