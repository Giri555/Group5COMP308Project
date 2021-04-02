// react
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player';
// import axios
import axios from "axios";

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function PatientPortalHome(props){

        // Your logic here ...
        

        return (
                <Container>
                        <div>
                                <Button href='/clinic/patient/emergency-alerts' variant='primary' type='Link'>
                                        Emergency Alerts
                                </Button>
                                <Button variant='primary'>
                                        List of Motivational Tips
                                </Button>
                                <Button variant='primary'>
                                        Enter Daily Information
                                </Button>
                        </div>

                        <h1 className='display-4 mt-3 text-center'>Motivational Videos</h1>
                        <p className='text-muted text-center'>
                                Get yourself healthy with these recommended videos.
                        </p>
                        <div>
                                <ReactPlayer url="https://www.youtube.com/watch?v=T1XLHsz4r_M"/>
                                <ReactPlayer url="https://www.youtube.com/watch?v=XtyLfJa3clI"/>                              
                        </div>
                </Container>
        );
};

export default PatientPortalHome;
// export default withRouter(ComponentTemplate); // or this