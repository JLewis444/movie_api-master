import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Form from 'react-bootstrap/Form';

import { setFilter } from '../../actions/actions';

function VisibilityFilterInput(props) {
    return <Form.Control
       onChange={e => props.setFilter(e.target.value)}
       value={props.VisibilityFilter}
       placeholder="filter"
      />; 
}

export default connect(
    null,
    { setFilter }
)(VisibilityFilterInput);