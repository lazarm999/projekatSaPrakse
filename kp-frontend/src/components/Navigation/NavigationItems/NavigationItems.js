import React from 'react';
import { Translate } from "react-localize-redux";
import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'
import LanguageSelect from '../../LanguageSelect/LanguageSelect';

class NavigationItems extends React.Component {
    render() {
        return (
            <ul className={classes.NavigationItems}>
                <NavigationItem link={(process.env.REACT_APP_ROUTER_BASE || '') + "/" } target="_self"><Translate id="tabs.map" /></NavigationItem>
                <NavigationItem link={(process.env.REACT_APP_ROUTER_BASE || '') + "/contact"} target="_self"><Translate id="tabs.contact" /></NavigationItem>
                <LanguageSelect />
            </ul>
        );
    }
};
export default NavigationItems; 