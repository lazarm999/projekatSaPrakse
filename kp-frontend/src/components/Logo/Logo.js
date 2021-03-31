import React from 'react';
import classes from './Logo.css'
import niriLogo from '../../assets/images/logo1.png'
const logo = (props) => (
    <div className = {classes.Logo}>
        <img src={niriLogo} alt="logo"/>
    </div>

);

export default logo;