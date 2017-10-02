import _ from 'lodash';
import React, { PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingSpinner from '../../../components/LoadingSpinner';

import { normalizePhoneForServer, normalizePhoneDisplay } from '../../../../app/common/helper/functions';
import RowItem from './RowItem';
import CenteredModal from '../../../components/CenteredModal/index';
import { AddUserForm } from '../../DashboardManageUsers/DashboardManageUsersAddUserForm';
import { selectDashboardAdmins, selectDashboardEditUserProcess, selectDashboardManageUsersSearchFormValues, selectPaginationOptions } from '../selectors';
import { editDashboardUser, deleteDashboardUser, setActiveSort } from '../actions';

const mapStateToProps = createStructuredSelector({
  editUserProcess: selectDashboardEditUserProcess(),
  searchFormValues: selectDashboardManageUsersSearchFormValues(),
  paginationOptions: selectPaginationOptions(),
  admins: selectDashboardAdmins(),
});

function mapDispatchToProps(dispatch) {
  return {
    editDashboardUser: (payload) => dispatch(editDashboardUser(payload)),
    deleteDashboardUser: (payload) => dispatch(deleteDashboardUser(payload)),
    setActiveSort: (sort, direction) => dispatch(setActiveSort(sort, direction)),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DashboardManageUsersTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    admins: React.PropTypes.object,
    editDashboardUser: React.PropTypes.func,
    deleteDashboardUser: React.PropTypes.func,
    editUserProcess: React.PropTypes.object,
    roles: React.PropTypes.object,
    searchFormValues: React.PropTypes.object,
    setActiveSort: React.PropTypes.func,
    paginationOptions: React.PropTypes.object,
    loadMore: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      editUserModalOpen: false,
      editUserInitValues: {},
    };

    this.editUserClick = this.editUserClick.bind(this);

    this.closeEditUserModal = this.closeEditUserModal.bind(this);
    this.openEditUserModal = this.openEditUserModal.bind(this);

    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.sortBy = this.sortBy.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if ((!newProps.editUserProcess.saving && this.props.editUserProcess.saving) ||
     (!newProps.editUserProcess.deleting && this.props.editUserProcess.deleting)) {
      this.closeEditUserModal();
    }
  }

  componentWillUnmount() {
    const defaultSort = 'first_name';
    this.props.setActiveSort(defaultSort, null);
  }

  editUserClick(item) {
    this.setState({ editUserInitValues: {
      initialValues: {
        ...item,
        firstName: item.first_name,
        lastName: item.last_name,
        role: item.role_id,
        phone: normalizePhoneDisplay(item.phone),
      },
    } });
    this.openEditUserModal();
  }

  closeEditUserModal() {
    this.setState({ editUserModalOpen: false });
  }

  openEditUserModal() {
    this.setState({ editUserModalOpen: true });
  }

  updateUser(params) {
    const normalizedParams = params;
    normalizedParams.phone = normalizePhoneForServer(normalizedParams.phone);
    this.props.editDashboardUser(normalizedParams);
  }

  deleteUser(params) {
    this.props.deleteDashboardUser({ user_id: params });
  }

  sortBy(ev) {
    ev.preventDefault();
    let sort = ev.currentTarget.dataset.sort;
    let direction = 'up';


    if (ev.currentTarget.className && ev.currentTarget.className.indexOf('up') !== -1) {
      direction = 'down';
    } else if (ev.currentTarget.className && ev.currentTarget.className.indexOf('down') !== -1) {
      direction = null;
      sort = null;
    }

    this.props.setActiveSort(sort, direction);
  }

  render() {
    if (!this.props.admins) {
      return null;
    }

    let admins = this.props.admins.details;

    if (this.props.paginationOptions.activeDirection && this.props.paginationOptions.activeSort) {
      const dir = ((this.props.paginationOptions.activeDirection === 'down') ? 'desc' : 'asc');
      admins = _.orderBy(admins, [(o) => (o[this.props.paginationOptions.activeSort])], [dir]);
    }

    return (
      <div className="table-holder">
        <InfiniteScroll
          pageStart={0}
          loadMore={this.props.loadMore}
          initialLoad={false}
          hasMore={this.props.paginationOptions.hasMoreItems}
          loader={null}
        >
          <table className="table-manage-user table client-admins">
            <caption>Admins</caption>

            <thead>
              <tr>
                <th onClick={this.sortBy} data-sort="first_name" className={`th ${(this.props.paginationOptions.activeSort === 'first_name') ? this.props.paginationOptions.activeDirection : ''}`}>Name<i className="caret-arrow" /></th>
                <th onClick={this.sortBy} data-sort="email" className={`th ${(this.props.paginationOptions.activeSort === 'email') ? this.props.paginationOptions.activeDirection : ''}`}>Email<i className="caret-arrow" /></th>
                <th onClick={this.sortBy} data-sort="phone" className={`th ${(this.props.paginationOptions.activeSort === 'phone') ? this.props.paginationOptions.activeDirection : ''}`}>Phone<i className="caret-arrow" /></th>
                <th onClick={this.sortBy} data-sort="role_name" className={`th ${(this.props.paginationOptions.activeSort === 'role_name') ? this.props.paginationOptions.activeDirection : ''}`}>Role<i className="caret-arrow" /></th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {
                admins.map((item, index) => (
                  <RowItem key={index} item={item} editUserClick={this.editUserClick} />
                ))
              }
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5">
                  {this.props.admins.fetching && <div className="text-center"><LoadingSpinner showOnlyIcon /></div>}
                </td>
              </tr>
            </tfoot>
          </table>
        </InfiniteScroll>


        <Modal dialogComponentClass={CenteredModal} className="new-user" id="new-user" show={this.state.editUserModalOpen} onHide={this.closeEditUserModal}>
          <Modal.Header>
            <Modal.Title>EDIT USER</Modal.Title>
            <a className="lightbox-close close" onClick={this.closeEditUserModal}>
              <i className="icomoon-icon_close" />
            </a>
          </Modal.Header>
          <Modal.Body>
            <div className="holder clearfix">
              <AddUserForm
                {...this.state.editUserInitValues}
                isEdit
                onSubmit={this.updateUser}
                onDelete={this.deleteUser}
                saving={this.props.editUserProcess.saving}
                deleting={this.props.editUserProcess.deleting}
                roles={this.props.roles}
              />
            </div>
          </Modal.Body>
        </Modal>

      </div>
    );
  }
}
