import React from 'react';
import { withLocalize } from "react-localize-redux";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FaLanguage } from 'react-icons/fa';
import colors from '../../css/colors.css';
import {isDefined} from '../../constants/functions'

class LanguageSelect extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            dropdownOpen: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    handleChange(code) {
        this.props.setActiveLanguage(code);
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {
        return (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle className={colors.primaryColor}>
                    <FaLanguage />
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem
                        active={isDefined(this.props.activeLanguage) ? this.props.activeLanguage.code === "rs" : false}
                        onClick={() => this.handleChange("rs")}>
                        RS
                    </DropdownItem>
                    <DropdownItem
                        active={isDefined(this.props.activeLanguage) ? this.props.activeLanguage.code === "en" : false}
                        onClick={() => this.handleChange("en")}>
                        EN
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }
}

export default withLocalize(LanguageSelect);