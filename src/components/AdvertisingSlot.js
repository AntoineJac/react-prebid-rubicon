import React, { Component } from 'react';
import connectToAdServer from './utils/connectToAdServer';
import PropTypes from 'prop-types';

class AdvertisingSlot extends Component {
    componentDidMount() {
        const { activate, id, customEventHandlers, active } = this.props;
        if (active) {
            activate(id, customEventHandlers);
        }
    }

    componentDidUpdate(prevProps) {
        const { activate, id, customEventHandlers, active, shouldRefresh } = this.props;
        if (prevProps.activate !== activate || active) {
            if (shouldRefresh) {
                activate(id, customEventHandlers);
            }
        }
    }

    render() {
        const { id, style, className, children } = this.props;
        return <div id={id} style={style} className={className} children={children} />;
    }
}

AdvertisingSlot.propTypes = {
    id: PropTypes.string.isRequired,
    active: PropTypes.bool,
    style: PropTypes.object,
    shouldRefresh: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    activate: PropTypes.func,
    customEventHandlers: PropTypes.objectOf(PropTypes.func).isRequired
};

AdvertisingSlot.defaultProps = {
    customEventHandlers: {},
    active: true,
    shouldRefresh: false
};

export default connectToAdServer(AdvertisingSlot);
