import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NagivationItem';
 //for bool values you dont have to pass anything (see active)

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/">Burger Builder</NavigationItem>
        <NavigationItem link="/orders">Orders</NavigationItem>
    </ul>
);

export default navigationItems;