import React from "react"
import { PieChart, Legend } from 'react-easy-chart';
import { Row, Col } from 'reactstrap';
import classes from './Chart.css';

class Chart extends React.Component {

    render() {
        return(
            <div className={classes.ChartContainer}>
                <Row>
                    <Col md={{ size: 8, order: 0, offset: 0 }}>
                        <Row>
                            <PieChart data={this.props.chartData}></PieChart>  
                        </Row>
                    </Col>
                    <Col md={{ size: 4, order: 0, offset: 0 }}>
                        <Row>
                            <Legend data={this.props.chartData} dataId={'key'} />
                        </Row>
                    </Col>
                </Row>   
            </div>
        );
    }
}

export default Chart;