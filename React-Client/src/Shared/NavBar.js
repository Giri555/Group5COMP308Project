// react
import React from 'react';
// import any react-bootstrap components you may need:
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

function NavBar() {
    return (
        <div>
            <Navbar bg='dark' variant='dark' expand='lg'>
                <Navbar.Brand href='/clinic/home'>HBGC Clinic</Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='mr-auto'>
                        <Nav.Link href='/clinic/home'>Home</Nav.Link>
                        <Nav.Link href='/clinic/nurse/portal'>
                            Nurse Portal
                        </Nav.Link>
                        <Nav.Link href='/clinic/patient/portal'>
                            Patient Portal
                        </Nav.Link>
                    </Nav>
                    <Button variant='outline-info mr-2' href='/clinic/sign-in'>
                        Sign In
                    </Button>
                    <Button variant='outline-info' href='/clinic/sign-up'>
                        Sign Up
                    </Button>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default NavBar;
