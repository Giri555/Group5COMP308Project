// react
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import PatientList from "./PatientsList";
import EmergencyAlertsList from "./EmergencyAlertsList";
import MotivationalTipsList from "./MotivationalTipsList";
import VitalSignsList from "./VitalSignsList";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter,
} from "react-router-dom";

// import axios
import axios from "axios";

// import any react-bootstrap components you may need:
import Container from "react-bootstrap/Container";

// import any of our components you may need:

function NursePortalHome(props) {
  // read the info from props, coming from the ancestor component
  const { screen, setScreen } = props;
  const [character, setCharacter] = useState("");

  const listAlert = () => {
    setCharacter("a");
  };

  const listPatient = () => {
    setCharacter("p");
  };

  const listMotivationalTips = () => {
    setCharacter("t");
  };

  const listOfVitalSigns = () => {
    setCharacter("s");
  };

  return (
    <Container>
      {(() => {
        switch (character) {
          case "a":
            return <EmergencyAlertsList screen={screen} setScreen={screen} />;
          case "t":
            return <MotivationalTipsList screen={screen} setScreen={screen} />;
          case "s":
            return <VitalSignsList screen={screen} setScreen={screen} />;
          case "p":
            return <PatientList screen={screen} setScreen={screen} />;
          default:
            return (
              <div>
                <h1>Nurse Portal</h1>
                <h2>Nurse: {screen}</h2>
                <br />
                <br />
                <Button variant="success" type="submit" onClick={listAlert}>
                  List of Alerts
                </Button>
                <br />
                <br />
                <Button
                  className="mx-3"
                  variant="primary"
                  type="submit"
                  onClick={listMotivationalTips}
                >
                  List of Tips
                </Button>
                <br />
                <br />
                <Button variant="info" type="submit" onClick={listOfVitalSigns}>
                  List of Vital Signs
                </Button>

                <br />
                <br />
                <Button variant="warning" type="submit" onClick={listPatient}>
                  List of Patients
                </Button>
              </div>
            );
        }
      })()}
    </Container>
  );
}

export default NursePortalHome;
