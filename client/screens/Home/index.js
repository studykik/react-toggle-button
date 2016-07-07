import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import StatsBar from './StatsBar'

class Home extends React.Component {
  render () {
    return (
      <div className="container">
        <StatsBar />
      </div>
    )
  }
}

const mapStateToProps = () => ({})
const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
