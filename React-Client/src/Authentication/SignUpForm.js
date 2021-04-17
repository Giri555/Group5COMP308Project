// react
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

// import axios
import axios from 'axios';

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

// import any of our components you may need:

function SignUpForm(props) {
    console.log(props.screen);
    const apiUrl = 'http://localhost:5000/api/index/sign-up';
    const [error, setError] = useState(false);
    const [user, setUser] = useState({
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const onChange = (e) => {
        e.persist();
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    const signUp = (e) => {
        e.preventDefault();
        const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
        };
        axios
            .post(apiUrl, userData)
            .then((result) => {
                console.log(result.data);
                if (result.data.error === true) setError(true);
                else props.history.push('/clinic/sign-in');
            })
            .catch((error) => {
                setError(true);
            });
    };

    return (
        <Container>
            <h1 className='display-4 mt-3 text-center'>Sign Up</h1>
            <Form className='mt-3' onSubmit={signUp}>
                <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        onChange={onChange}
                        name='firstName'
                        value={user.firstName}
                        type='text'
                        placeholder='Enter first name'
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        onChange={onChange}
                        name='lastName'
                        value={user.lastName}
                        type='text'
                        placeholder='Enter last name'
                        required
                    />
                </Form.Group>

                <Form.Group>
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
                        If you are a nurse, please sign up with the email
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
                    Sign Up
                </Button>
            </Form>
            {error === true && (
                <Alert variant='danger' className='mt-3'>
                    Please try again, sign up failed.
                </Alert>
            )}
        </Container>
    );
}

export default withRouter(SignUpForm);
