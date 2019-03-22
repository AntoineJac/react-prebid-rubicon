import React from 'react';
import AdvertisingContext from '../../AdvertisingContext';

export default Component => props => (
    <AdvertisingContext.Consumer>
        {({activate, active}) => <Component {...props} activate={activate} active={active} />}
    </AdvertisingContext.Consumer>
);
