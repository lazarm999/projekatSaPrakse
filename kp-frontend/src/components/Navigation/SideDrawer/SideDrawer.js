import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
import BackDrop from '../../UI/Backdrop/Backdrop';

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close ];
    if (props.open){
        attachedClasses = [classes.SideDrawer, classes.Open];
    } 
    return (
        <div>
        <BackDrop show={props.open} clicked= {props.closed}/>
        <div className = {attachedClasses.join(' ')}>
            <div className = {classes.Logo}>
        <Logo/>
        </div>
        <nav>
            <NavigationItems/>
            </nav>
            </div>
            </div>
    );
}

export default sideDrawer;