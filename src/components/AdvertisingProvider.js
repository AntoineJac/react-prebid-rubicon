import React, { Component } from 'react';
import Advertising from '../Advertising';
import PropTypes from 'prop-types';
import AdvertisingConfigPropType from './utils/AdvertisingConfigPropType';
import AdvertisingContext from '../AdvertisingContext';
import equal from 'fast-deep-equal';

export default class AdvertisingProvider extends Component {
    constructor(props) {
        super(props);
        this.initialize();
        this.state = {
            shouldRefresh: false,
            firstCall: true,
            advertising: this.advertising
        };
    }

    componentDidMount() {
        if (this.advertising.isConfigReady() && this.props.active) {
            this.advertising.setup();
        }
    }

    componentDidUpdate() {
        const { config, active } = this.props;
        const { advertising, shouldRefresh } = this.state;
        const isConfigReady = advertising.isConfigReady();

        // activate advertising when the config changes from `undefined`
        if (!isConfigReady && config && active) {
            advertising.setConfig(config);
            advertising.setup();
        } else if (isConfigReady && shouldRefresh && config.singleRequest && active) {
            advertising.setup();
        }
    }

    componentWillUnmount() {
        if (this.props.config) {
            this.advertising.teardown();
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { firstCall, advertising } = state;
        if (!firstCall && !equal(props.config, advertising.prevConfig) && props.shouldRefresh) {
            advertising.teardown();

            const { config, plugins, active } = props;
            const newAdvertising = new Advertising(config, plugins);
            const isConfigReady = newAdvertising.isConfigReady();

            if (isConfigReady && !config.singleRequest && active) {
                newAdvertising.setup();
            }

            return {
                advertising: newAdvertising,
                shouldRefresh: true
            };
        }

        if (firstCall) {
            return {
                firstCall: false
            };
        }

        return {
            shouldRefresh: false
        };
    }

    initialize() {
        const { config, plugins } = this.props;
        this.advertising = new Advertising(config, plugins);
    }

    render() {
        const { advertising, shouldRefresh } = this.state;
        const data = {
            activate: advertising.activate.bind(this.state.advertising),
            resetSlot: advertising.resetSlot.bind(this.state.advertising),
            active: this.props.active,
            shouldRefresh
        };
        return <AdvertisingContext.Provider value={data}>{this.props.children}</AdvertisingContext.Provider>;
    }
}

AdvertisingProvider.propTypes = {
    active: PropTypes.bool,
    shouldRefresh: PropTypes.bool,
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
    active: true,
    shouldRefresh: false
};
