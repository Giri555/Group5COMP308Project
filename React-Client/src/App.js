import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import NavBar from './Shared/NavBar';
import Home from './Home';
import SignInForm from './Authentication/SignInForm';
import SignUpForm from './Authentication/SignUpForm';
import NursePortalHome from './NursePortal/NursePortalHome';
import PatientPortalHome from './PatientPortal/PatientPortalHome';

// import MotivationalTipForm from './NursePortal/MotivationalTipForm';
// import MotivationalTipsList from './PatientPortal/MotivationalTipsList';
// import MotivationalTipDetail from './NursePortal/MotivationalTipDetail';
// import PatientListwAddButton from './NursePortal/PatientListwAddButton';
// import PatientsList from './NursePortal/PatientsList';

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

            {/* route for nurse portal */}
            <Route render={() => <NursePortalHome />} path='/clinic/nurse/portal' />

            {/*route for patient portal*/}
            <Route render={() => <PatientPortalHome />} path='/clinic/patient/portal' />

        </Router>
    );
}

export default App;
