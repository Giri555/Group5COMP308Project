import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import { withRouter } from 'react-router-dom';

function MotivationalTipsList() {

    const [tips, setTips] = useState([]);

    const fetch = async () => {
      const getPatient = 'http://localhost:5000/api/patient/read-cookie';
      const result = await axios.get(getPatient, {withCredentials: true, credentials: 'include'});
      if (result.data) {
        const getTipIds = `http://localhost:5000/api/patients/${result.data.patient.payload.id}`;
        const result2 = await axios.get(getTipIds, {withCredentials: true,credentials: 'include'});
        const tipIdsArr = result2.data.motiTipList;
        if (result2.data) {
            const getMotivationalTipApiUrl = 'http://localhost:5000/api/motivationalTips/';
            let tipArray = [];
            for (let i = 0; i < tipIdsArr.length; i++) {
                const tip = await axios(getMotivationalTipApiUrl + tipIdsArr[i], {withCredentials: true,credentials: 'include'});
                tipArray.push(tip.data);
            }
            setTips(tipArray);
        }
      }
    };

    useEffect(() => {
      fetch();
    }, []);

    return (
        <Container className="mt-2">
              <h2>List Of Motivational Tips</h2>
              <ListGroup>
                {tips.map((tip, idx) => (
                    <ListGroup.Item key={idx}>
                        <h4>{tip.title}</h4>
                        <p>{tip.content}</p>
                    </ListGroup.Item>
                ))}
                </ListGroup>
        </Container>
    );
}

export default withRouter(MotivationalTipsList);
