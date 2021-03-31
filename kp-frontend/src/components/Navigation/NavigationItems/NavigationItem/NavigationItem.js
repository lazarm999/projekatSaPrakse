import React from 'react';
import classes from './NavigationItem.css'

class NavigationItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: this.isActive(),
        }

        this.isActive = this.isActive.bind(this);
    }

    isActive() {
        var currentUrl = window.location.href;
        if(this.props.link.indexOf("contact") > -1) {
            return currentUrl.indexOf("contact") > -1;
        } else {
            return !(currentUrl.indexOf("contact") > -1);
        }
    }

    render() {
        return (
            <li className={classes.NavigationItem}>
                <a
                    href={this.props.link}
                    className={this.state.active ? classes.active : null}>
                    {this.props.children}
                </a>
            </li>
        );
    }
};


export default NavigationItem;