import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { withLocalize } from "react-localize-redux";
import translations from "../../constants/translations.json";
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components//Navigation/SideDrawer/SideDrawer';
import KPMapContainer from '../../containers/KPMapContainer/KPMapContainer'
import Contact from "../../components/Contact/Contact"

class Layout extends Component {

    constructor(props) {
        super(props);

        this.props.initialize({
            languages: [
                { name: "English", code: "en" },
                { name: "Serbian", code: "rs" }
            ],
            options: { renderToStaticMarkup }
        });
        this.props.addTranslation(translations);
        this.props.setActiveLanguage("rs");
    }

    state = {
        showSideDrawer: false
    };
    SideDrawerClosedHandler = () => {
        this.setState({ showSideDrawer: false })

    };
    SideDrawerToggleHandler = () => {
        this.setState(
            (prevState) => {
                return { showSideDrawer: !this.state.showSideDrawer }
            });

    }
    render() {
        return (
            <div>
                <Toolbar toggled={this.SideDrawerToggleHandler} />
                <SideDrawer open={this.state.showSideDrawer} closed={this.SideDrawerClosedHandler} />
                <main className={classes.Content} > {this.props.children}
                    <Router>
                    <div>
                            <Route exact path="/kp" component={KPMapContainer} />
                            <Route path="/kp/contact" component={Contact} />
                    </div>
                    </Router>
                </main>
            </div>
        );
    }
};

export default withLocalize(Layout);
