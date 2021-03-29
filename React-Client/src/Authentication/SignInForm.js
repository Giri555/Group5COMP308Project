// react
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';

// import axios
import axios from "axios";

// import any react-bootstrap components you may need:
import Container from 'react-bootstrap/Container';

// import any of our components you may need:



function SignInForm(props){

        // Your logic here ...
        

        return (
                <Container>
                        {/* Whatever you want to display goes inside this container */}
                        <h1>sign in</h1>
                </Container>
        );
};

export default SignInForm;
// export default withRouter(ComponentTemplate); // or this