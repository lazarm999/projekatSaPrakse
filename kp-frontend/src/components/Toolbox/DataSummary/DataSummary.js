import React from 'react';
import { Translate } from "react-localize-redux";
import { Container, Row, Col } from 'reactstrap';
import { formatNumber, isDefined } from '../../../constants/functions';

class DataSummary extends React.Component {

    render() {
        return (
            <Container>
                <Row>
                    <Col md={{ size: 12, offset: 1}}>
                        <Translate id="dataSummary.adCount" />{isDefined(this.props.adsSummaryData.adCount) ? formatNumber(this.props.adsSummaryData.adCount) : 0}
                        <br />
                        <Translate id="dataSummary.valueOfAds" data={{ value: isDefined(this.props.adsSummaryData.valueOfAds) ? formatNumber(this.props.adsSummaryData.valueOfAds) : 0 }} />
                        <br />
                        <Translate id="dataSummary.timePeriod" data={{ days: isDefined(this.props.adsSummaryData.timePeriod) ? this.props.adsSummaryData.timePeriod : 0 }} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default DataSummary;