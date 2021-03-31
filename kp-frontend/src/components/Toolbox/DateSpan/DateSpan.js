import React from 'react';
import { Translate } from "react-localize-redux";
import { DateRange } from 'react-date-range';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import classNames from 'classnames';
import classes from './DateSpan.css'
import colors from '../../../css/colors.css';

class DateSpan extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectionRange: {},
        }

        this.handleChange = this.handleChange.bind(this);
        this.submitDate = this.submitDate.bind(this);
        this.openDateModal = this.openDateModal.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    handleChange(range) {
        this.setState({
            selectionRange: {
                startDate: range.selection.startDate,
                endDate: range.selection.endDate,
                key: 'selection'
            },
        });
    }

    submitDate() {
        this.toggle();
        let startDate = this.parseDate(this.state.selectionRange.startDate);
        let endDate = this.parseDate(this.state.selectionRange.endDate);

        this.props.handleDatesChange({
            startDate: startDate,
            endDate: endDate,
        });
    }

    openDateModal() {
        this.setState({
            selectionRange: {
                startDate: moment(this.props.startDate),
                endDate: moment(this.props.endDate),
                key: 'selection'
            },
        });
        this.toggle();
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    parseDate(dateString) {
        let date = moment(dateString)._d;
        let day = (date.getDate() < 10 ? '0' : '') + date.getDate();
        let month = date.getMonth() + 1;
        month = (month < 10 ? '0' : '') + month;
        return date.getFullYear() + '-' + month + '-' + day;
    }

    formatDate(dateString) {
        let date = moment(dateString)._d;
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let day = date.getDate();
        let month = months[date.getMonth()];
        let year = date.getFullYear();
        return month + " " + day + ", " + year;
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={{ size: 12, offset: 1 }}>
                        <div className={classes.Wrapper}>
                            <Row>
                                <Col md={{ size: 1 }} className={classes.Text}>
                                    <span><Translate id="priceRangeSelect.from" />:</span>
                                </Col>
                                <Col md={{ size: 4 }}>
                                    <Button className={classNames(colors.primaryColor, classes.DateSelectButton)} onClick={this.openDateModal} size="sm">
                                        {this.formatDate(this.props.startDate)}
                                    </Button>
                                </Col>
                                <Col md={{ size: 1 }} className={classes.Text}>
                                    <span><Translate id="priceRangeSelect.to" />:</span>
                                </Col>
                                <Col md={{ size: 4 }}>
                                    <Button className={classNames(colors.primaryColor, classes.DateSelectButton)} onClick={this.openDateModal} size="sm">
                                        {this.formatDate(this.props.endDate)}
                                    </Button>
                                </Col>
                            </Row>
                            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                                <ModalHeader toggle={this.toggle}><Translate id="dateSpan.chooseDate" /></ModalHeader>
                                <ModalBody>
                                    <Row>
                                        <DateRange
                                            className={classes.DateRange}
                                            rangeColors={["#284A88"]}
                                            ranges={[this.state.selectionRange]}
                                            onChange={this.handleChange} />
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button className={colors.primaryColor} onClick={this.submitDate}><Translate id="button.submit" /></Button>
                                    <Button color="secondary" onClick={this.toggle}><Translate id="button.cancel" /></Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

}

export default DateSpan;