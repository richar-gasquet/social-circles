import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Loading from "../../components/shared-components/LoadingSpinner";

function CarouselComponent({ announcements, isQuerying }) {
  return (
    <Carousel indicators={false} slide={false}>
      {isQuerying ? (
        <Loading />
      ) : announcements.length > 0 ? (
        announcements.map((ann) => (
          <Carousel.Item key={ann.announcement_id} style={{ maxHeight: '350px', overflow: 'hidden' }}>
            <img
              className="d-block w-100"
              src={ann.image_link}
              alt={ann.announcement_name}
              style={{ objectFit: 'cover', maxHeight: '100%' }}
            />
            <Carousel.Caption style={{ margin: '5em'}}>
              <h3>{ann.announcement_name}</h3>
              <p>{ann.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))
      ) : (
        <Carousel.Item key="no-announcements" style={{ maxHeight: '400px', overflow: 'hidden' }}>
          <img
            className="d-block w-100"
            src="https://t3.ftcdn.net/jpg/03/08/93/14/360_F_308931411_1lkVPXmBNd2IojYMSdGaz7sedkSr5Q2w.jpg"
            alt="No Announcements"
            style={{ objectFit: 'cover', maxHeight: '100%' }}
          />
          <Carousel.Caption style={{ margin: '7em'}}>
            <h2>There are no announcements.</h2>
          </Carousel.Caption>
        </Carousel.Item>
      )}
    </Carousel>
  );
}

export default CarouselComponent;