import React from 'react';
import { Translate } from "react-localize-redux";
import ToggleButton from 'react-toggle-button';
import { Row, Col } from 'reactstrap';
import { FaCheck, FaTimes } from '../../../../../node_modules/react-icons/fa';
import classes from './Option.css';

class Option extends React.Component {
    render() {
        return (
            <Row>
                <Col md={{ size: 9 }}>
                    <Translate id={this.props.translationId} />
                </Col>
                <Col md={{ size: 3 }}>
                    <Row className={classes.ToggleButton}>
                        <ToggleButton
                            inactiveLabel={<FaTimes />}
                            activeLabel={<FaCheck />}
                            value={this.props.value}
                            onToggle={(this.props.onToggle)}
                            colors={{
                                active: {
                                    base: 'rgb(40, 74, 136)'
                                }
                            }} />
                    </Row>
                </Col>
            </Row>
        );
    }
}
export default Option;