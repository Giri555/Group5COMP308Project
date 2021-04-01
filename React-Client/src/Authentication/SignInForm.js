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
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

// import any of our components you may need:

function SignInForm(props) {
    const apiUrl = 'http://localhost:5000/api/index/sign-in';
    const [error, setError] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: '',
    });
    const onChange = (e) => {
        e.persist();
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    const signIn = (e) => {
        e.preventDefault();
        const userData = {
            email: user.email,
            password: user.password,
        };
        axios
            .post(apiUrl, userData, {withCredentials: true, credentials: 'include'})
            .then((result) => {
                console.log(result.data.screen);
                if(result.data.data.nurse){
                        props.history.push('/clinic/nurse/portal');
                }
                else if(result.data.data.patient){
                        props.history.push('/clinic/patient/portal');
                }
                else{
                        setError(true);
                }
            })
            .catch((error) => {
                setError(true);
            });
    };

    return (
        <Container>
            <h1 className='display-4 mt-3 text-center'>Sign In</h1>
            <p className='text-muted text-center'>
                You are not signed in, please sign in to continue.
            </p>
            <Form className='mt-3' onSubmit={signIn}>
                <Form.Group controlId='formBasicEmail'>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        onChange={onChange}
                        name='email'
                        value={user.email}
                        type='email'
                        placeholder='Enter email'
                        required
                    />
                    <Form.Text className='text-muted'>
                        If you are a nurse, please sign in with the email
                        '@nurse.ca'
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId='formBasicPassword'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        onChange={onChange}
                        name='password'
                        value={user.password}
                        type='password'
                        placeholder='Password'
                        required
                    />
                    <Form.Text className='text-muted'>
                        Passwords must have a minimum of 7 characters.
                    </Form.Text>
                </Form.Group>

                <Button variant='info' type='submit'>
                    Sign In
                </Button>
            </Form>
            {error === true && (
                <Alert variant='danger' className='mt-3'>
                    You were not authorized, please try again, or sign up.
                </Alert>
            )}
        </Container>
    );
}

export default withRouter(SignInForm);
