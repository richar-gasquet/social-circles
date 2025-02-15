import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import CardButton from '../card-components/CardButton';
import Loading from "../../components/shared-components/LoadingSpinner";
import he from "he";
import UpdateAnnouncement from './UpdateAnnouncement';
import DeleteAnnouncement from './DeleteAnnouncement';
import styles from "../../css/Card.module.css";
import CarouselCaption from 'react-bootstrap/esm/CarouselCaption';

/* Carousel component for announcements in User Dashboard*/
function CarouselComponent(props) {
  const [showDeleteAnn, setShowDeleteAnn] = useState(false);
  const [selectedAnn, setSelectedAnn] = useState({ id: null, name: null, desc: null, img: null });
  const [showEditAnn, setShowEditAnn] = useState(false);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  
  return (
    <Carousel indicators={false} slide={false}>
      { /* Display announcements */}
      {props.isQuerying ? (
        <Loading />
      ) : props.announcements.length > 0 ? (
        props.announcements.map((ann) => (
          <Carousel.Item key={ann.announcement_id} style={{ maxHeight: '350px', overflow: 'hidden' }}>
            <img
              className="d-block w-100"
              src={ann.image_link}
              alt={he.decode(ann.announcement_name)}
              style={{ objectFit: 'cover', maxHeight: '100%' }}
            />
            <Carousel.Caption style={{ position: 'absolute', top: '40%', left: '50%', 
              transform: 'translate(-50%, -50%)', textAlign: 'center', width: '60%',
              whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              <h3 style={{ fontSize: '2.5vw' }}>{he.decode(ann.announcement_name)}</h3>
              <p style={{ fontSize: '1.8vw' }}>{he.decode(ann.description)}</p>
            </Carousel.Caption>
            <CarouselCaption>
              {/* Check if user is admin to display CRUD buttons */}
              {props.isAdmin && (
                <div className={`${styles.cardButtons} d-flex justify-content-center`}>
                  <CardButton
                    className="mr-2"
                    action={(e) => { e.stopPropagation(); setShowEditAnn(true); 
                      setSelectedAnn({ id: ann.announcement_id, name: he.decode(ann.announcement_name),
                        desc: he.decode(ann.description), img: ann.image_link}); }}
                    message="Edit Announcement"
                    icon="fas fa-edit"
                  ></CardButton>
                  <CardButton
                    action={(e) => { e.stopPropagation(); setShowDeleteAnn(true);
                      setSelectedAnn({ id: ann.announcement_id, name: he.decode(ann.announcement_name),
                        desc: he.decode(ann.description), img: ann.image_link}); }}
                    message="Delete Announcement"
                    icon="fas fa-trash"
                  ></CardButton>
                </div>
              )}
            </CarouselCaption>
          </Carousel.Item>
        ))
      ) : (
        <Carousel.Item key="no-announcements" style={{ maxHeight: '350px', overflow: 'hidden' }}>
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
      {/* Show modals if CRUD buttons are clicked*/}
      {showEditAnn && props.isAdmin && (
        <div className="edit-ann-modal" onClick={(e) => stopPropagation(e)}>
        <UpdateAnnouncement
          isShown={showEditAnn}
          handleClose={(e) => { e.stopPropagation(); setShowEditAnn(false);
            setSelectedAnn({ id: null, name: null, desc: null, img: null }); }}
          announcement_id={selectedAnn.id}
          announcement_name={he.decode(selectedAnn.name)}
          description={he.decode(selectedAnn.desc)}
          image_link={selectedAnn.img}
          updateAnnouncements={props.updateAnnouncements}
        />
        </div>

      )}
      {showDeleteAnn && props.isAdmin && (
        <div className="delete-ann-modal" onClick={(e) => stopPropagation(e)}>
        <DeleteAnnouncement
          isShown={showDeleteAnn}
          handleClose={(e) => { e.stopPropagation(); setShowDeleteAnn(false);
            setSelectedAnn({ id: null, name: null, desc: null, img: null }); }}
          announcement_id={selectedAnn.id}
          announcement_name={selectedAnn.name}
          fetchAnnouncements={props.fetchAnnouncements}
        />
        </div>
      )}
    </Carousel>
  );
}

export default CarouselComponent;