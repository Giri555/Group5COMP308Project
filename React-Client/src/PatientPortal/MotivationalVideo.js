import React from 'react';
import ReactPlayer from 'react-player';

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';

function MotivationalVideo() {
    return (
        <Container>
            <h1 className='display-4 mt-3 text-center'>Motivational Videos</h1>
            <p className='text-muted text-center'>
                Get yourself healthy with these recommended videos.
            </p>
            <Container >
                <Container className='my-3' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <ReactPlayer url='https://www.youtube.com/watch?v=T1XLHsz4r_M' />
                </Container>

                <Container className='my-3' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <ReactPlayer url='https://www.youtube.com/watch?v=XtyLfJa3clI' />
                </Container>
            </Container>
        </Container>
    );
}

export default MotivationalVideo;