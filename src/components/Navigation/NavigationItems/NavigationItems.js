import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NagivationItem';
 //for bool values you dont have to pass anything (see active)

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/">Burger Builder</NavigationItem>
        { props.isAuthenticated ? <NavigationItem link="/orders">Orders</NavigationItem> : null }
        { !props.isAuthenticated
            ? <NavigationItem link="/auth">Login</NavigationItem>
            : <NavigationItem link="/logout">Logout</NavigationItem> 
        }
    </ul>
);

export default navigationItems;