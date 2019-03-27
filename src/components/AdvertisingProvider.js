import React, { Component } from 'react';
import Advertising from '../Advertising';
import PropTypes from 'prop-types';
import AdvertisingConfigPropType from './utils/AdvertisingConfigPropType';
import AdvertisingContext from '../AdvertisingContext';

export default class AdvertisingProvider extends Component {
    constructor(props) {
        super(props);
        this.advertising = new Advertising(props.config, props.plugins);
        this.state = {
            config: props.config,
            advertising: this.advertising,
            activate: this.advertising.activate.bind(this.advertising)
        };
    }

    componentDidMount() {
        if (this.props.active) {
            this.state.advertising.setup();
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.config !== state.config) {
            const advertising = new Advertising(props.config, props.plugins);
            return {
                config: props.config,
                advertising,
                activate: advertising.activate.bind(advertising)
            };
        }
        return null;
    }

    componentDidUpdate(prevPros) {
        if (this.props.active && prevPros.config !== this.props.config) {
            this.state.advertising.setup();
        }
    }

    componentWillUnmount() {
        if (this.state.advertising) {
            this.state.advertising.teardown();
        }
    }

    render() {
        const data = { activate: this.state.activate, active: this.props.active };
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
