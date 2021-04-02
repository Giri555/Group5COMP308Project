import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player';

// import axios
import axios from "axios";

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';

// import any of our components you may need:



function MotivationalVideo(props){

        return (
                <Container>
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

export default MotivationalVideo;