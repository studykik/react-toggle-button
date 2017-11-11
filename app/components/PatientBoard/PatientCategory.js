/* eslint-disable no-cond-assign */
/**
 * Created by mike on 10/24/16.
 */

import React from 'react';
import { connect } from 'react-redux';
// import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';
import { createStructuredSelector } from 'reselect';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import * as Selector from '../../containers/StudyPage/selectors';
import { selectCurrentUser } from '../../containers/App/selectors';
import DragTypes from './dragSourceTypes';
import Patient from './Patient';
import {
  schedulePatient,
  submitMovePatientBetweenCategories,
  showScheduledModal,
} from '../../containers/StudyPage/actions';
/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const patientTarget = {
  drop(props, monitor) {
    if (monitor.didDrop()) {
      return;
    }

    const patientDragSwitcher = (category, item, patientId) => {
      if (category.name === 'Scheduled') {
        // store the scheduled patient information temporarily since the user could cancel out of their category movement
        // props.schedulePatient(props.studyId, item.patientCategoryId, props.category.id, item.id);
        props.onPatientDraggedToScheduled(item.id, item.patientCategoryId, category.id);
      } else {
        props.submitMovePatientBetweenCategories(props.studyId, item.patientCategoryId, category.id, item.id, patientId);
      }
    };

    // access the coordinates
    const clientOffset = monitor.getClientOffset();
    const el = document.elementFromPoint(clientOffset.x, clientOffset.y);
    // Obtain the dragged item
    const item = monitor.getItem();
    let patientId = null;
    let ancestor = null;

    const findAncestor = (el, cls) => {
      let i = el;
      while ((i = i.parentElement) && !i.classList.contains(cls));
      return i;
    };

    ancestor = findAncestor(el, 'patient-li');

    if (ancestor) {
      patientId = parseInt(ancestor.dataset.patientId);
      if (!ancestor.previousSibling) {
        patientId = null;
      } else {
        patientId = parseInt(ancestor.previousSibling.dataset.patientId);
        // patientId = parseInt(ancestor.dataset.patientId);

        if (!ancestor.nextSibling) {
          patientId = parseInt(ancestor.dataset.patientId);
        }

        if (item.id === patientId) {
          patientId = parseInt(ancestor.dataset.patientId);
        }
      }
    }

    if (!props.study.suvodaProtocolId || props.study.suvodaProtocolId === '') {
      patientDragSwitcher(props.category, item, patientId);
    } else if (props.category.id !== 6 && props.category.id !== 7 && props.category.id !== 8 && item.patientCategoryId !== 6 && item.patientCategoryId !== 7 && item.patientCategoryId !== 8) {
      patientDragSwitcher(props.category, item, patientId);
    }
  },
};

const collect = (connect, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDropTarget: connect.dropTarget(),
  // You can ask the monitor about the current drag state:
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType(),
});

@DropTarget(DragTypes.PATIENT, patientTarget, collect)
class PatientCategory extends React.Component {
  static propTypes = {
    study: React.PropTypes.object.isRequired,
    studyId: React.PropTypes.number.isRequired,
    category: React.PropTypes.object.isRequired,
    connectDropTarget: React.PropTypes.func.isRequired,
    currentPatientId: React.PropTypes.number,
    currentSite: React.PropTypes.object,
    submitMovePatientBetweenCategories: React.PropTypes.func.isRequired,
    onPatientClick: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    onPatientTextClick: React.PropTypes.func.isRequired,
    currentUser: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      columnWidth: '',
      hover: false,
    };
    this.handleResize = this.handleResize.bind(this);
    this.renderPatients = this.renderPatients.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      hover: nextProps.isOver,
    });
  }

  componentDidUpdate() {
    if (this.state.columnWidth === '') {
      this.handleResize();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    const patientColumn = this.patientColumn;

    this.setState({ columnWidth: `${patientColumn.clientWidth}px` });
  }

  renderPatients() {
    const { category, currentPatientId, onPatientClick, onPatientTextClick, currentSite } = this.props;

    if (category.patients.length > 0) {
      const getLastUpdate = (patient) => {
        const tempMax = moment.max(moment(patient.createdAt), moment(patient.updatedAt));
        if (patient.lastTextMessage && patient.lastTextMessage.dateCreated) {
          return moment.max(tempMax, moment(patient.lastTextMessage.dateCreated));
        }

        return tempMax;
      };

      // sort the patients into the categories
      const sorted = _.orderBy(category.patients, (patient) => getLastUpdate(patient), 'desc');

      return (
        <div className="slide">
          <div className="slide-holder">
            <ul className="list-unstyled">
              {sorted.map(patient => (
                <Patient
                  key={patient.id}
                  category={category}
                  currentUser={this.props.currentUser}
                  currentPatientId={currentPatientId}
                  patient={patient}
                  unreadMessageCount={patient.unreadMessageCount}
                  currentSite={currentSite}
                  onPatientClick={onPatientClick}
                  onPatientTextClick={onPatientTextClick}
                />
                ))}
            </ul>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    const { category, connectDropTarget } = this.props;

    const openerStyle = {
      width: this.state.columnWidth,
    };
    return connectDropTarget(
      <li
        key={category.id}
        ref={(patientColumn) => {
          this.patientColumn = patientColumn;
        }}
        className={classNames({ active: this.state.hover, hover: this.state.hover })}
      >
        <span className="opener" style={openerStyle}>
          <strong className="number">{category.patients.length}</strong>
          <span className="text">{category.name}</span>
        </span>
        {this.renderPatients()}
      </li>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentPatientId: Selector.selectCurrentPatientId(),
  currentSite: Selector.selectSite(),
  study: Selector.selectStudy(),
  studyId: Selector.selectStudyId(),
  currentUser: selectCurrentUser(),
});

const mapDispatchToProps = (dispatch) => ({
  /* action to schedule patient with a corresponding modal */
  schedulePatient: (studyId, fromCategoryId, toCategoryId, patientId) => dispatch(schedulePatient(studyId, fromCategoryId, toCategoryId, patientId)),
  showScheduledModal: () => dispatch(showScheduledModal()),
  submitMovePatientBetweenCategories: (studyId, fromCategoryId, toCategoryId, patientId, afterPatientId) => dispatch(submitMovePatientBetweenCategories(studyId, fromCategoryId, toCategoryId, patientId, afterPatientId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientCategory);
