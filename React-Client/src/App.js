import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import NavBar from './Shared/NavBar';
import Home from './Home';
import SignInForm from './Authentication/SignInForm';
import SignUpForm from './Authentication/SignUpForm';
import NursePortalHome from './NursePortal/NursePortalHome';
import PatientPortalHome from './PatientPortal/PatientPortalHome';

function App() {
    return (
        <Router>
            <NavBar />
            <Route exact path='/'>
                <Redirect to='/clinic/home'></Redirect>
            </Route>
            <Route render={() => <Home />} path='/clinic/home' />
            <Route render={() => <SignInForm />} path='/clinic/sign-in' />
            <Route render={() => <SignUpForm />} path='/clinic/sign-up' />

            {/* Create your Routes below */}
            <Route render={() => <NursePortalHome />} path='/clinic/nurse/portal' />
            <Route render={() => <PatientPortalHome />} path='/clinic/patient/portal' />
        </Router>
    );
}

export default App;
