import React, { Component } from 'react';
import Advertising from '../Advertising';
import PropTypes from 'prop-types';
import AdvertisingConfigPropType from './utils/AdvertisingConfigPropType';
import AdvertisingContext from '../AdvertisingContext';

export default class AdvertisingProvider extends Component {
    componentDidMount() {
        if (this.props.active) {
            this.advertising.setup();
        }
    }

    componentDidUpdate() {
        if (this.props.active) {
            this.advertising.setup();
        }
    }

    componentWillUnmount() {
        if (this.advertising) {
            this.advertising.teardown();
        }
    }

    render() {
        this.advertising = new Advertising(this.props.config, this.props.plugins);
        this.activate = this.advertising.activate.bind(this.advertising);
        const data = { activate: this.activate, active: this.props.active };
        return <AdvertisingContext.Provider value={data}>{this.props.children}</AdvertisingContext.Provider>;
    }
}

AdvertisingProvider.propTypes = {
    active: PropTypes.bool,
    config: AdvertisingConfigPropType,
    children: PropTypes.node,
    plugins: PropTypes.arrayOf(
        PropTypes.shape({
            setupPrebid: PropTypes.func,
            setupGpt: PropTypes.func,
            teardownPrebid: PropTypes.func,
            teardownGpt: PropTypes.func
        })
    )
};

AdvertisingProvider.defaultProps = {
    active: true
};
