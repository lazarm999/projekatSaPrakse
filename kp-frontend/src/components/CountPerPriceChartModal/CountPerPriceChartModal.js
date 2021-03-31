import React from 'react';
import { Translate } from "react-localize-redux";
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import CountPerPriceChartTooltip from './CountPerPriceChartTooltip';
import classes from './CountPerPriceChartModal.css'

class CountPerPriceChartModal extends React.Component {
    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.close}
            contentClassName={classes.ModalContent}
            className={classes.CenterModal}>
                <ModalHeader toggle={this.props.close}>
                    <Translate id={"chart.adCountDistributionOverPrice"}/>
                </ModalHeader>
                <ModalBody style={{padding: "10px"}}>
                    <AreaChart width={850} height={400} data={this.props.chartAreaData}
                        margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                        <XAxis
                            dataKey='priceRSD'
                            name='cena'
                            type="number"
                            domain={[this.props.minPriceRSD, this.props.maxPriceRSD]}
                            tickCount={12}
                            />
                        <YAxis />
                        <Tooltip content={<CountPerPriceChartTooltip />}/>
                        <Area
                            type='monotone'
                            dataKey='adCount'
                            stroke='#8884d8'
                            fill='#8884d8' />
                    </AreaChart>
                </ModalBody>
            </Modal>
        );
    }
}

export default CountPerPriceChartModal;