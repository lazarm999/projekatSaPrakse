import React from "react"
import { Translate } from "react-localize-redux";
import Slider, { createSliderWithTooltip } from 'rc-slider';
import { Container, Row, Col, ButtonGroup, Button } from 'reactstrap';
import moment from 'moment';
import classes from './RangeSlider.css';
import colors from '../../../css/colors.css';
import '../../../css/slider.global.css';

const Range = createSliderWithTooltip(Slider.Range);

class RangeSlider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sliderValue: [1, this.props.interval],
        }

        this.handleIntervalChange = this.handleIntervalChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleIntervalChange(interval) {
        this.setState({
            sliderValue: [1, interval],
        })
        this.props.handleIntervalChange(interval);
    }

    handleChange(value) {
        let currValue = this.state.sliderValue;
        let change = value[0] - currValue[0];
        value[1] += change;
        if (change === 0) {
            change = value[1] - currValue[1];
            value[0] += change;
        }
        if (value[0] > this.props.maxDays - this.props.interval + 1) {
            value[0] = this.props.maxDays - this.props.interval + 1;
        }
        if (value[0] <= 1) {
            value[0] = 1;
        }
        if (value[1] > this.props.maxDays) {
            value[1] = this.props.maxDays;
        }
        if (value[1] <= this.props.interval) {
            value[1] = this.props.interval;
        }

        if (value[0] !== currValue[0]) {
            this.props.handleDateRange(value[0] - 1);
        }

        this.setState({
            sliderValue: value,
        })
    }

    formatDate(value) {
        let minDate = moment(this.props.minDate);
        return minDate.add(value - 1, 'days').format('DD-MM-YYYY');
    }

    render() {
        const intervals = [7, 14, 30];
        return (
            <Container>
                <Row>
                    <Col md={{ size: 12, offset: 1}}>
                        <Translate>
                            {
                                ({ translate }) =>
                                    <div>
                                        <div className={classes.Wrapper}>
                                            <Range
                                                disabled={false}
                                                min={1}
                                                max={this.props.maxDays}
                                                value={this.state.sliderValue}
                                                onChange={this.handleChange}
                                                tipFormatter={value => this.formatDate(value)}
                                                tipProps={
                                                    {
                                                        placement: 'top',
                                                    }
                                                }
                                                trackStyle={
                                                    [
                                                        { backgroundColor: "#284A88" },
                                                        { height: "200px" },
                                                    ]
                                                }
                                                handleStyle={
                                                    [
                                                        { border: "solid 2px #284A88" }
                                                    ]
                                                }
                                            />
                                        </div>
                                        <ButtonGroup>
                                            <Button
                                                className={this.props.interval === this.props.maxDays ? colors.primaryColor : null}
                                                onClick={() => this.handleIntervalChange(this.props.maxDays)}
                                                size="sm">
                                                <Translate id="rangeSlider.wholeInterval" />
                                            </Button>
                                            {
                                                intervals.map((element) => (
                                                    <Button
                                                        className={this.props.interval === element && this.props.maxDays !== element ? colors.primaryColor : null}
                                                        key={element}
                                                        onClick={() => this.handleIntervalChange(element)}
                                                        size="sm"
                                                        disabled={element >= this.props.maxDays}>
                                                        {element + ' ' + translate("rangeSlider.days")}
                                                    </Button>
                                                ))
                                            }
                                        </ButtonGroup>
                                    </div>
                            }
                        </Translate>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default RangeSlider;