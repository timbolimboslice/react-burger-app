import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NagivationItem';

configure({adapter: new Adapter()});

describe('<NavigationItems />', () => {
    //use for general setup
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<NavigationItems />);
    });
    //look at enzyme doucmenation on how to use more methods like 'find'
    
    //look at jest (validation library) documentation for more on how to use expect
    //mock is another one to look for jest
    it('should render two <NavigationItem /> elements if not authenticated', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it('should render three <NavigationItem /> elements if authenticated', () => {
        wrapper.setProps({
            isAuthenticated: true
        });
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });

    //look at enzyme doucmenation on how to use more methods like 'contain'
    it('should show an exact logout button if logged in', () => {
        wrapper.setProps({
            isAuthenticated: true
        });
        expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);
    });

});