import React, { useState, useEffect } from "react";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import { withRouter } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";

function MotivationalTipsList(props) {
  const [data, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);

  const apiUrl = "http://localhost:5000/api/nurse/motivationalTips";

  useEffect(() => {
    console.log('inside useEffect');
    const fetchData = async () => {
      axios.get(apiUrl,{withCredentials: true, credentials: 'include'})
        .then(result => {
          console.log('result.data:',result.data)
            setData(result.data);
            setShowLoading(false);
        }).catch((error) => {
          console.log('error in fetchData:', error)
        });
      };  
    fetchData();
  }, []);

  const showDetail = (id) => {
       props.history.push({
       pathname: '/clinic/nurse/motivationalTips/'+id,   
  });
  };

  const createTip = ()=>{
     props.history.push({
       pathname: '/clinic/nurse/motivationalTipForm'
     })
  }

  return (
    <div>
      <div>
            {showLoading && (
                <Spinner animation='border' role='status'>
                    <span className='sr-only'>Loading...</span>
                </Spinner>
            )}
            <div>
               <h1>List Of Motivational Tips</h1>    
               <Button type="button" variant="warning" onClick={() => { createTip() }}>Create Motivational Tip</Button>&nbsp;     
            <ListGroup>
                {data.map((tip, idx) => (
                    <ListGroup.Item
                        key={idx}
                        action  onClick={() => {
                          showDetail(tip._id);
                      }}>
                            {tip.title}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            </div>
        </div>
    </div>
  );
}
//
export default withRouter(MotivationalTipsList);
