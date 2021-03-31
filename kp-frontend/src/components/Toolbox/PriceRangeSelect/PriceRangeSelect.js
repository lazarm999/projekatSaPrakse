import React from 'react';
import { Translate } from 'react-localize-redux';
import { Container, Row, Col, Button, Input, InputGroup, } from 'reactstrap';
import { FaChartArea } from 'react-icons/fa';
import axios from 'axios';
import CountPerPriceChartModal from '../../CountPerPriceChartModal/CountPerPriceChartModal'
import classNames from 'classnames';
import classes from './PriceRangeSelect.css';
import colors from '../../../css/colors.css';
import { SERVER_ADDRESS, API_GET_COUNT_PER_PRICE } from '../../../constants/constants'


class PriceRangeSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isCountPerPriceChartModalOpen: false,
      chartAreaData: [],
      minPriceRSD: 0,
      maxPriceRSD: 0,
    }

    this.openCountPerPriceChartModal = this.openCountPerPriceChartModal.bind(this);
    this.closeCountPerPriceChartModal = this.closeCountPerPriceChartModal.bind(this);
    this.getCountPerPrice = this.getCountPerPrice.bind(this);
    this.receiveCountPerPriceChartData = this.receiveCountPerPriceChartData.bind(this);
  }

  closeCountPerPriceChartModal() {
    this.setState(prevState => ({
      isCountPerPriceChartModalOpen: !prevState.isCountPerPriceChartModalOpen
    }));
  }

  openCountPerPriceChartModal() {
    this.setState(prevState => ({
      isCountPerPriceChartModalOpen: !prevState.isCountPerPriceChartModalOpen
    }));
    this.getCountPerPrice();
  }

  receiveCountPerPriceChartData(data) {
    let maxPriceRSD = data.maxPriceRSD;
    let minPriceRSD = data.minPriceRSD;
    this.setState({
      chartAreaData:  data.adCountByPriceInterval,
      minPriceRSD: minPriceRSD,
      maxPriceRSD: maxPriceRSD
    });
  }

  getCountPerPrice() {
    let receiveCountPerPriceChartData = this.receiveCountPerPriceChartData;
    axios({
      method: 'post',
      url: SERVER_ADDRESS + API_GET_COUNT_PER_PRICE,
      data: {
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        searchTerm: this.props.searchTerm,
        categoryId: this.props.categoryId,
        priceLow: this.props.priceLow,
        priceHigh: this.props.priceHigh,
        dedup: this.props.dedup,
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        receiveCountPerPriceChartData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {

      });
  }
  render() {
    return (
      <Container>
        <CountPerPriceChartModal
          isOpen={this.state.isCountPerPriceChartModalOpen}
          close={this.closeCountPerPriceChartModal}
          chartAreaData={this.state.chartAreaData} 
          minPriceRSD={this.state.minPriceRSD}
          maxPriceRSD={this.state.maxPriceRSD}/>
        <Row>
          <Col md={{ size: 12, offset: 1 }}>
            <div className={classes.Wrapper}>
              <Row>
                <Col md={{ size: 1 }} className={classes.Text}>
                  <span><Translate id="priceRangeSelect.from" />:</span>
                </Col>
                <Col md={{ size: 4 }}>
                  <InputGroup size="sm">
                    <Input
                      type="text"
                      placeholder={0}
                      value={this.props.priceLow}
                      onKeyPress={this.props.handleKeyPress}
                      onChange={this.props.handlePriceLowChange} />
                  </InputGroup>
                </Col>

                <Col md={{ size: 1 }} className={classes.Text}>
                  <span><Translate id="priceRangeSelect.to" />:</span>
                </Col>
                <Col md={{ size: 4 }}>
                  <InputGroup size="sm">
                    <Input
                      type="text"
                      placeholder={0}
                      value={this.props.priceHigh}
                      onKeyPress={this.props.handleKeyPress}
                      onChange={this.props.handlePriceHighChange} />
                  </InputGroup>
                </Col>

                <Col md={{ size: 2 }}>
                  <Button
                    className={classNames(colors.primaryColor, "float-right")}
                    onClick={this.openCountPerPriceChartModal}
                    size="sm">
                    <FaChartArea />
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default PriceRangeSelect;