import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';

function NurseList() {
    const [data, setData] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const apiUrl = 'http://localhost:3000/api/nurses';

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(apiUrl);
            setData(result.data);
            setShowLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div>
            {showLoading && (
                <Spinner animation='border' role='status'>
                    <span className='sr-only'>Loading...</span>
                </Spinner>
            )}
            <ListGroup>
                {data.map((item, idx) => (
                    <ListGroup.Item
                        key={idx}
                        action>
                            ({item.studentNumber})
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default withRouter(NurseList);
