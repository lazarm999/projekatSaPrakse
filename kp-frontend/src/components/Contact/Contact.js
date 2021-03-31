import React, { Component } from 'react';
import { Translate } from "react-localize-redux";
import containerClass from "../../css/container.css"
import { Row, Col, FormGroup, Input, Label, Button } from 'reactstrap';
import classes from './Contact.css';
import colors from '../../css/colors.css';
import ReCAPTCHA from "react-google-recaptcha";
import Iframe from 'react-iframe';
import { SERVER_ADDRESS, API_SEND_MAIL } from '../../constants/constants'
import axios from 'axios';

class Contact extends Component {

    constructor() {
        super();

        this.state = {
            name: "lazar",
            email: "lazarminic028@gmail.com",
            message: "poruka",
            isRobot: true,
        }
        this.sendMail = this.sendMail.bind(this);
    }

    sendMail() {
        if (!(this.state.name === "" || this.state.email === "" || this.state.message === "" || this.state.isRobot)) {
            axios({
                method: 'post',
                url: SERVER_ADDRESS + API_SEND_MAIL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    name: this.state.name,
                    email: this.state.email,
                    message: this.state.message
                },
            })
                .then(function (response) {
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {

                });
        }
    }

    render() {
        return (
            <div className={containerClass.Container} md={{ size: 11, order: 2, offset: 1 }}>
                <Row>
                    <Col lg={{ size: 6, order: 2, offset: 0 }}>
                        <h4 className={classes.Caption}><Translate id="contact.address" /></h4>
                        <p className={classes.Info}>Đerdapska 67A, 18108 Niš, Sebia</p>
                        <h4 className={classes.Caption}><Translate id="contact.telephone" /></h4>
                        <p className={classes.Info}>+381 18 288 088</p>
                        <h4 className={classes.Caption}><Translate id="contact.email" /></h4>
                        <p className={classes.Info}>contact@niri-ic.com</p>
                        <Iframe url="https://goo.gl/xznSVU"
                            width="600px"
                            height="400px"
                            allowFullScreen />
                    </Col>
                    <Col lg={{ size: 6, order: 2, offset: 0 }}>
                        <Translate>
                            {
                                ({ translate }) =>
                                    <div>
                                        <h3 style={{ textAlign: "center", color: "gray" }}>{translate("contact.contactUs")}</h3>
                                        <FormGroup>
                                            <Label for="name"><Translate id="contact.name" /></Label>
                                            <Input type="text" placeholder={translate("contact.polaceHolders.name")}
                                                onChange={(e) => this.setState({ name: e.target.value })} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="email"><Translate id="contact.email" /></Label>
                                            <Input type="email" placeholder={translate("contact.polaceHolders.email")}
                                                onChange={(e) => this.setState({ email: e.target.value })} />
                                        </FormGroup>
                                        <Input type="textarea" placeholder={translate("contact.polaceHolders.message")}
                                            style={{ height: '300px' }} onChange={(e) => this.setState({ message: e.target.value })} />
                                    </div>
                            }
                        </Translate>
                        <Row>
                            <Col md={{ size: 6, order: 2, offset: 0 }}>
                                <ReCAPTCHA
                                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                    onChange={() => this.setState({ isRobot: false })}
                                    className={classes.Recaptcha}
                                />
                            </Col>
                            <Col className={classes.ButtonContainer} md={{ size: 6, order: 2, offset: 0 }}>
                                <Button
                                    className={colors.primaryColor}
                                    id={classes.sendButton}
                                    onClick={this.sendMail}><Translate id="button.send" /></Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div >
        );
    }

};
export default Contact; 