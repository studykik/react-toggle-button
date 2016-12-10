import React, { PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import moment from 'moment';

import { SchedulePatientModalType } from 'common/constants';

import './styles.less';

const AllEventsModal = ({ visible, events, date, handleCloseModal, handleEdit, setAllModalDeferred }) => (
  <Modal show={visible} onHide={handleCloseModal}>
    <div id="all-patients" className="fixed-popup lightbox lightbox-active">
      <div className="lightbox-holder">
        <div className="lightbox-frame">
          <div className="lightbox-content">
            <div className="head">
              <strong className="title">{moment(date).format('dddd, MMMM DD, YYYY')}</strong>
              <a className="lightbox-close close" onClick={handleCloseModal}><i className="icomoon-icon_close"></i></a>
            </div>
            <div className="scroll-holder jcf--scrollable">
              <div className="list-head clearfix">
                <div className="col patient-name">Patient <i className="caret-arrow"></i></div>
                <div className="col site-location hidden">Site Location <i className="caret-arrow"></i></div>
                <div className="col protocol hidden">Protocol <i className="caret-arrow"></i></div>
                <div className="col time">Time <i className="caret-arrow"></i></div>
              </div>
              <div className="patient-list">
                <div className="list-holder">
                  <div className="list-unstyled">
                    {
                      events.map((event, index) => (
                        <li key={index}>
                          <a href="#edit-scedule" className="btn btn-gray-outline lightbox-opener">
                            <span className="patient-name">{`${event.data.patient.firstName} ${event.data.patient.lastName}`}</span>
                            <span className="time">{moment(event.data.time).format('h:mm A')}</span>
                            <span
                              className="btn btn-primary"
                              onClick={() => {
                                setTimeout(() => {
                                  handleCloseModal();
                                  setAllModalDeferred(true);
                                }, 700);
                                handleEdit(SchedulePatientModalType.UPDATE, event);
                              }}
                            >
                              edit
                            </span>
                          </a>
                        </li>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
);

AllEventsModal.propTypes = {
  visible: PropTypes.bool,
  events: PropTypes.array,
  date: PropTypes.object,
  handleCloseModal: PropTypes.func,
  handleEdit: PropTypes.func,
  setAllModalDeferred: PropTypes.func,
};

export default AllEventsModal;