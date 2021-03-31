import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import classes from './ColorLegend.css'
import { scaleLinear } from "d3-scale"

const gradientScale = [
    { percent: 100},
    { percent:  90},
    { percent:  80},
    { percent:  70},
    { percent:  60},
    { percent:  50},
    { percent:  40},
    { percent:  30},
    { percent:  20},
    { percent:  10},
    { percent:  0},
]
const popScale = scaleLinear()
  .domain([0, 100])
  .range(["#FFFFFF", "#284a88"]);

class ColorLegend extends Component {

    render() {
        return (
            <Col className={classes.Container}>
                {
                    gradientScale.map((element, i) => 
                        <Row key={i}> 
                            <div className={classes.GradientBox}
                                style={{backgroundColor: popScale(element.percent)}}></div>
                            <p className={classes.GradientPercent}>{this.props.breakpoints[i]} </p>
                        </Row>
                    )
                }
            </Col>
        );
    }
}

export default ColorLegend;
