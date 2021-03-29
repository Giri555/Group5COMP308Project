// react
import React from 'react';
// import any react-bootstrap components you may need:
import Carousel from 'react-bootstrap/Carousel';
import image1 from './Images/pressure.jpg';
import image2 from './Images/scope.jpg';

function Home() {
    return (
        <div>
            <Carousel fluid>
                <Carousel.Item>
                    <img
                        className='d-block w-100'
                        src={image1}
                        alt='First slide'
                    />
                    <Carousel.Caption>
                        <h3 className='text-dark'>Lorem, ipsum dolor.</h3>
                        <p className='text-dark'>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Harum, nisi?
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className='d-block w-100'
                        src={image2}
                        alt='First slide'
                    />
                    <Carousel.Caption>
                        <h3 className='text-dark'>Lorem, ipsum dolor.</h3>
                        <p className='text-dark'>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Harum, nisi?
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default Home;
