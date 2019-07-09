import React from 'react';
import AdvertisingContext from '../../AdvertisingContext';

export default Component => props => (
    <AdvertisingContext.Consumer>
        {({ activate, active, shouldRefresh }) => (
            <Component {...props} activate={activate} active={active} shouldRefresh={shouldRefresh} />
        )}
    </AdvertisingContext.Consumer>
);
