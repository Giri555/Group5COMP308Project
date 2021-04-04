import React, { useState, useEffect } from "react";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import { withRouter } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";

function MotivationalTipsList(props) {
  console.log("in patient-motivational tip list: " + props.patient);
  console.log("in motivationalTip - patient portal: props is " + props.patient);
 
  const [data, setData] = useState();
  const [tips, setTips] = useState([]);
  const [showLoading, setShowLoading] = useState(true);

  const apiUrl = "http://localhost:5000/api/patients/"+props.match.params.patientId;
  const getMotivationalTipApiUrl = "http://localhost:5000/api/motivationalTips/";

  useEffect(() => {
    setShowLoading(false);

    const fetchData = async () => {
      const result = await axios.get(apiUrl,{
        withCredentials: true,
        credentials: 'include',
    });
      console.log("results from patient", result.data);
      setData(result.data);
   
      let tipArray = [];
      for (let i = 0; i < result.data.motiTipList.length; i++) {
        const tip = await axios(
          getMotivationalTipApiUrl + result.data.motiTipList[i],{
            withCredentials: true,
            credentials: 'include',
        }
        );
        tipArray.push(tip.data);
      }
      setTips(tipArray);

      setShowLoading(false);
    };
    console.log('checking here: '+data);
    fetchData();
  }, []);

  return (
    <div>
      <div>
        {showLoading && (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
        <div>
          <h1>List Of Motivational Tips</h1>          
          <ListGroup>
            {tips.map((tip, idx) => (
              <ListGroup.Item key={idx} action>
                <h4>{tip.title}</h4>
                <p>{tip.content}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}

export default withRouter(MotivationalTipsList);
