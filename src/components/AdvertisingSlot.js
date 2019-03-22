import React, { Component } from 'react';
import connectToAdServer from './utils/connectToAdServer';
import PropTypes from 'prop-types';

class AdvertisingSlot extends Component {
    componentDidMount() {
        const { activate, active, id, customEventHandlers } = this.props;
        if (active) {
            activate(id, customEventHandlers);
        }
    }
    componentDidUpdate() {
        const { activate, active, id, customEventHandlers } = this.props;
        if (active) {
            activate(id, customEventHandlers);
        }
    }
    render() {
        const { id, style, className, children } = this.props;
        return <div id={id} style={style} className={className} children={children} />;
    }
}

AdvertisingSlot.propTypes = {
    id: PropTypes.string.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    activate: PropTypes.func.isRequired,
    active: PropTypes.bool,
    customEventHandlers: PropTypes.objectOf(PropTypes.func).isRequired
};

AdvertisingSlot.defaultProps = {
    customEventHandlers: {},
    active: true
};

export default connectToAdServer(AdvertisingSlot);
