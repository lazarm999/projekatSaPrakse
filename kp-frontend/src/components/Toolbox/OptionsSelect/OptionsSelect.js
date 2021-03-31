import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Option from './Option/Option'

class OptionsSelect extends React.Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col md={{ size: 12, offset: 1 }}>
                        <Option
                            translationId="normalizeData.normalizeDataPopulation"
                            value={this.props.normalizePopulation}
                            onToggle={this.props.handleNormalizeDataByPopulationToggle} />
                        <Option
                            translationId="normalizeData.normalizeDataSellers"
                            value={this.props.normalizeSellers}
                            onToggle={this.props.handleNormalizeDataBySellersToggle} />
                        <Option
                            translationId="deduplicateData"
                            value={this.props.dedup}
                            onToggle={this.props.handleDeduplicateData} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default OptionsSelect;