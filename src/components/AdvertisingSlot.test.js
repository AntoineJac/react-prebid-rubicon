import React from 'react';
import { spy, match } from 'sinon';
import expectSnapshot from '@mt-testutils/expect-snapshot';
import { mount, shallow } from 'enzyme';

const id = 'my-id';

describe('The advertising slot component', () => {
    let AdvertisingSlot, mockActivate;
    beforeEach(() => {
        mockActivate = spy();
        jest.mock('./utils/connectToAdServer', () => Component => props => (
            <Component {...props} activate={mockActivate} />
        ));
        AdvertisingSlot = require('./AdvertisingSlot').default;
               
    });
    it('renders correctly', () =>
        expectSnapshot(
            <AdvertisingSlot id={id} style={{ color: 'hotpink' }} className="my-class">
                <h1>hello</h1>
            </AdvertisingSlot>
        ));
    describe('when mounted', () => {
        beforeEach(() => mount(<AdvertisingSlot id={id} />));
        it('calls the activate function with the ID', () => void mockActivate.should.have.been.calledWith(id));
        it('calls the activate function with a collapse callback', () =>
            void mockActivate.should.have.been.calledWith(match.any, match.object));
    });
    describe('componentDidUpdate', () => {
        beforeEach(() => {
            const wrapper = mount(<AdvertisingSlot id={id} />);
            wrapper.setProps({ id: 'my-id1' });
            wrapper.update();
        });
        it('calls the activate function with the ID2', () => void mockActivate.should.have.been.calledWith('my-id1'));
        it('calls the activate function with a collapse callback2', () =>
            void mockActivate.should.have.been.calledWith(match.any, match.object));
    });
    describe('when mounted with active = false', () => {
        beforeEach(() => mount(<AdvertisingSlot id={id} active={false} />));
        it('constructs an AdvertisingSlot module with the provided configuration', () =>
            void mockActivate.should.not.have.been.called);
    });
    describe('when updated with active = false', () => {
        beforeEach(() => {
            const wrapper = mount(<AdvertisingSlot id={id} active={false} />);
            wrapper.setProps({ id: 'my-id1' });
            wrapper.update();
        });
        it('constructs an AdvertisingSlot module with the provided configuration', () =>
            void mockActivate.should.not.have.been.called);
    });    
    afterEach(() => jest.resetModules());
});
