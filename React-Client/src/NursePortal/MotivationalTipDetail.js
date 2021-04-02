import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

function MotivationalTipDetail(props){
    console.log('props.match.params', props.match.params.motivationalTipId)
    const [data, setData] =useState({});
    const [flag, setFlag] =useState('');
    const [showLoading, setShowLoading] = useState(true);
    const [error, setError] = useState('');
    const apiUrl = 'http://localhost:5000/api/motivationalTips/' + props.match.params.motivationalTipId;
    
    useEffect(()=>{
        setShowLoading(false);

        const fetchData = async()=>{
            //get the tip
            const result= await axios(apiUrl,{withCredentials: true, credentials: 'include'});
            setData(result.data);
        };
        console.log(data);
        fetchData()},[])

        const showPatients = (id) => {
            props.history.push({
              pathname: '/clinic/nurse/'+id+'/sendTo/patients'           
          });
          };

    return (
        <div>
          {showLoading && <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner> }    
       
             <Jumbotron>
    
            <h1>Title: {data.title}</h1>
            <p>Content: {data.content}</p>
           <p>
              <Button type="button" variant="primary" onClick={() => { showPatients(data._id) }}>Send to Patient</Button>
            </p>
            {error ? <h6>{error}</h6> : <h6></h6>}
          </Jumbotron>
             
        </div>
      );
}
export default withRouter(MotivationalTipDetail);