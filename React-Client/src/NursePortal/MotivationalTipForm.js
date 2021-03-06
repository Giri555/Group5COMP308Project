import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';

function MotivationalTipForm(props) {
    
    const nurseId = props.screen;
    console.log('props.screen',props.screen)
    const [tip, setTip] = useState({ _id: '', content: '', title: ''});
    const [showLoading, setShowLoading] = useState(false);
    const [error, setError] = useState('');
    
    const apiUrl = "http://localhost:5000/api/nurse/motivationalTips"
    
    const saveTip= (e) => {
        setShowLoading(true);
        e.preventDefault();
        const data = {title: tip.title, content: tip.content};

        axios.post(apiUrl, data, {withCredentials: true, credentials: 'include'})
        .then((result) => {
            setShowLoading(false);
            console.log('results from save tip:',result.data)
        }).catch((error) => {
          setError('Please try again, saving motivational tip failed.');
          setShowLoading(false);
        });
    };
    //
    const onChange = (e) => {
        e.persist();
        setTip({...tip, [e.target.name]: e.target.value});
      }
    
    return (
      <Container className='mt-1'>
        {showLoading && 
            <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
            </Spinner> 
        } 
        <div>
            <Form className='mt-3' onSubmit={saveTip}>
            <h3>Create a Motivational Tip</h3>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" id="title" placeholder="Enter title" value={tip.title} onChange={onChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Content</Form.Label>
                <Form.Control type="text" name="content" id="content" placeholder="Enter content" value={tip.content} onChange={onChange} />
              </Form.Group>      
              <Button variant="info" type="submit">
                Create Tip
              </Button>
              {error ? <h6>{error}</h6> : <h6></h6>}
            </Form>
          </div>
        </Container>
    );
}

export default withRouter(MotivationalTipForm);
