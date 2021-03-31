import React from 'react';
import { Translate } from "react-localize-redux";
import classes from './KPMapContainer.css'
import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import classnames from 'classnames';
import KpMap from '../../components/Map/KpMap';
import Chart from '../../components/Chart/Chart'
import Table from '../../components/Table/Table'
import DateSpan from '../../components/Toolbox/DateSpan/DateSpan';
import CategorySelect from '../../components/Toolbox/CategorySelect/CategorySelect';
import SearchField from '../../components/Toolbox/SearchField/SearchField';
import OptionsSelect from '../../components/Toolbox/OptionsSelect/OptionsSelect';
import RangeSlider from '../../components/Toolbox/RangeSlider/RangeSlider';
import PriceRangeSelect from '../../components/Toolbox/PriceRangeSelect/PriceRangeSelect';
import DataSummary from '../../components/Toolbox/DataSummary/DataSummary';
import axios from 'axios';
import moment from 'moment';
import HeatmapLegend from '../../components/HeatmapLegend/HeatmapLegend'
import {
  SERVER_ADDRESS,
  API_GET_CATEGORIES,
  API_GET_ADS,
  API_GET_ADS_SUMMARY,
  API_GET_REGION_HEAT,
  API_GET_MUNICIPALITY_HEAT,
  API_GET_STATIC_REGION_DATA,
  API_GET_STATIC_MUNICIPALITY_DATA,
} from '../../constants/constants';
import { isDefined } from '../../constants/functions'

const cityZoom = [5, 15, 50, 100, 150, 198, 198, 198, 198, 198];
const citiesWithOffset = new Map();
citiesWithOffset.set(153, 18);
citiesWithOffset.set(50, 18);
citiesWithOffset.set(160, 18);
citiesWithOffset.set(115, 18);
citiesWithOffset.set(109, 18);
citiesWithOffset.set(108, 18);
citiesWithOffset.set(111, 18);
citiesWithOffset.set(55, 18);
const changeMap = 2;

class KPMapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      activeTab: '1',
      inProgress: false,

      startDate: "2018-01-01",
      endDate: "2018-03-01",
      priceLow: "",
      priceHigh: "",
      searchTerm: "",
      categoryId: 0,
      subcategoryId: 0,
      normalizePopulation: true,
      normalizeSellers: false,
      dedup: false,
      interval: 60,

      adsSummaryData: {},
      cityDataAll: [],
      regionDataAll: [],
      municipalityDataAll: [],
      regionDataBreakpoints: [],
      municipalityDataBreakpoints: [],
      heatMapBreakpoints: [],
      cityMapData: [],
      heatMapData: new Map(),
      chartData: [],
      staticRegionData: new Map(),
      staticMunicipalityData: new Map(),

      cityCount: 0,
      zoomIndex: 0,
      categoryMap: new Map(),
      intervalStartDate: 0,
      maxDays: 60,
      isRegionShown: true,
      disableOptimization: false,
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.toggleTabs = this.toggleTabs.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handlePriceLowChange = this.handlePriceLowChange.bind(this);
    this.handlePriceHighChange = this.handlePriceHighChange.bind(this);
    this.handleKeyPressPrice = this.handleKeyPressPrice.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyPressSearch = this.handleKeyPressSearch.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    this.handleCategorySelect = this.handleCategorySelect.bind(this);
    this.handleNormalizeDataByPopulationToggle = this.handleNormalizeDataByPopulationToggle.bind(this);
    this.handleNormalizeDataBySellersToggle = this.handleNormalizeDataBySellersToggle.bind(this);
    this.handleDeduplicateData = this.handleDeduplicateData.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handleDateRange = this.handleDateRange.bind(this);
    this.handleZoomChange = this.handleZoomChange.bind(this);
    this.setCityDataForGeography = this.setCityDataForGeography.bind(this);
    this.setCityData = this.setCityData.bind(this);
    this.setHeatMapData = this.setHeatMapData.bind(this);
    this.receiveAdsSummary = this.receiveAdsSummary.bind(this);
    this.receiveCityDataAll = this.receiveCityDataAll.bind(this);
    this.receiveRegionDataAll = this.receiveRegionDataAll.bind(this);
    this.receiveMunicipalityDataAll = this.receiveMunicipalityDataAll.bind(this);
    this.receiveStaticRegionData = this.receiveStaticRegionData.bind(this);
    this.receiveStaticMunicipalityData = this.receiveStaticMunicipalityData.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.updateCategories = this.updateCategories.bind(this);
    this.hideProgressBar = this.hideProgressBar.bind(this);
    this.getNormalizeParameter = this.getNormalizeParameter.bind(this);
    this.getDataForTable = this.getDataForTable.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.setState({
      inProgress: true,
    });
    this.getCategories();
    this.getStaticRegionData();
    this.getStaticMunicipalityData();
    this.sendRequest();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  toggleTabs(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  handleDatesChange(selectedDates) {
    let startDate = moment(selectedDates.startDate);
    let endDate = moment(selectedDates.endDate);
    let maxDays = endDate.diff(startDate, 'days') + 1;

    var sendRequest = this.sendRequest;

    this.setState({
      inProgress: true,
      startDate: startDate,
      endDate: endDate,
      maxDays: maxDays,
      interval: maxDays,
    }, () => {
      sendRequest();
    });
  }

  handlePriceLowChange(event) {
    this.setState({
      priceLow: event.target.value
    });
  }

  handlePriceHighChange(event) {
    this.setState({
      priceHigh: event.target.value
    });
  }

  handleKeyPressPrice(event) {
    if (event.key === 'Enter') {
      var sendRequest = this.sendRequest;
      this.setState({
        inProgress: true,
      }, () => {
        sendRequest();
      });
    }
  }

  handleCategorySelect(categoryId, subcategoryId) {
    var sendRequest = this.sendRequest;

    this.setState({
      inProgress: true,
      categoryId: categoryId,
      subcategoryId: subcategoryId,
    }, () => {
      sendRequest();
    });
  }

  handleSearch(event) {
    this.setState({
      searchTerm: event.target.value,
    })
  }

  handleKeyPressSearch(event) {
    if (event.key === 'Enter') {
      this.handleSubmitSearch();
    }
  }

  handleSubmitSearch() {
    var sendRequest = this.sendRequest;
    this.setState({
      inProgress: true,
    }, () => {
      sendRequest();
    });
  }

  handleDeduplicateData() {
    var sendRequest = this.sendRequest;

    this.setState((prevState) => ({
      inProgress: true,
      dedup: !prevState.dedup,
    }), () => {
      sendRequest();
    })
  }

  handleNormalizeDataByPopulationToggle() {
    var sendRequest = this.sendRequest;

    this.setState((prevState) => ({
      inProgress: true,
      normalizePopulation: !prevState.normalizePopulation,
      normalizeSellers: false,
    }), () => {
      sendRequest();
    })
  }

  handleNormalizeDataBySellersToggle() {
    var sendRequest = this.sendRequest;

    this.setState((prevState) => ({
      inProgress: true,
      normalizeSellers: !prevState.normalizeSellers,
      normalizePopulation: false,
    }), () => {
      sendRequest();
    })
  }

  handleIntervalChange(interval) {
    var sendRequest = this.sendRequest;

    this.setState({
      inProgress: true,
      interval: interval,
    }, () => {
      sendRequest();
    });
  }

  handleDateRange(startDay) {
    if (this.state.zoomIndex >= changeMap) {
      if (isDefined(this.state.municipalityDataAll[startDay])) {
        let data = this.state.municipalityDataAll[startDay];
        this.setHeatMapData(data);
      }
    } else {
      if (isDefined(this.state.regionDataAll[startDay])) {
        let data = this.state.regionDataAll[startDay];
        this.setHeatMapData(data);
      }
    }

    if (isDefined(this.state.cityDataAll[startDay])) {
      let data = this.state.cityDataAll[startDay];
      this.setCityData(data, cityZoom[this.state.zoomIndex]);
    }

    this.setState({
      intervalStartDate: startDay,
    })
  }

  handleZoomChange(value) {
    let newZoomIndex = this.state.zoomIndex + value;
    let cityCountShow = cityZoom[newZoomIndex];
    let heatMapBreakpoints = this.state.heatMapBreakpoints;

    if (isDefined(this.state.cityDataAll[this.state.intervalStartDate])) {
      this.setCityData(this.state.cityDataAll[this.state.intervalStartDate], cityCountShow);
    }

    if (this.state.zoomIndex > newZoomIndex) {
      if (newZoomIndex <= changeMap - 1) {
        if (isDefined(this.state.regionDataAll[this.state.intervalStartDate])) {
          this.setHeatMapData(this.state.regionDataAll[this.state.intervalStartDate]);
          heatMapBreakpoints = this.state.regionDataBreakpoints;
        }
      }
    } else if (this.state.zoomIndex < newZoomIndex) {
      if (newZoomIndex >= changeMap) {
        if (isDefined(this.state.municipalityDataAll[this.state.intervalStartDate])) {
          this.setHeatMapData(this.state.municipalityDataAll[this.state.intervalStartDate]);
          heatMapBreakpoints = this.state.municipalityDataBreakpoints;
        }
      }
    }

    this.setState((prevState) => ({
      zoomIndex: newZoomIndex,
      isRegionShown: prevState.zoomIndex + value < changeMap,
      heatMapBreakpoints: heatMapBreakpoints,
    }));
  }

  setCityDataForGeography(geographyId) {
    if (isDefined(this.state.cityDataAll[this.state.intervalStartDate])) {
      var data = this.state.cityDataAll[this.state.intervalStartDate];
      let cityMapData = [];

      data.forEach(element => {
        if (isDefined(element.city) && element.city !== null) {
          if ((this.state.isRegionShown && element.city.regionId === geographyId)
            || (!this.state.isRegionShown && element.city.municipalityId === geographyId)) {
            cityMapData.push({
              name: element.city.cityName,
              coordinates: [element.city.lng, element.city.lat],
              adCount: element.adCount,
              markerOffset: -10
            });
          }
        }
      });

      this.setState({
        cityMapData: cityMapData
      })
    }
  }

  setCityData(data, cityCountShow) {
    let chartData = [], cityMapData = [];
    let maxCities = 10;
    let rest = 0;
    let i = 0;
    data.forEach(element => {
      if (isDefined(element.city) && element.city !== null) {
        if (i < maxCities) {
          chartData.push({
            key: element.city.cityName,
            value: element.adCount,
          });
        } else {
          rest += element.adCount;
        }
        if (i < cityCountShow) {
          cityMapData.push({
            cityId: element.city.id,
            name: element.city.cityName,
            coordinates: [element.city.lng, element.city.lat],
            adCount: element.adCount,
            markerOffset: isDefined(citiesWithOffset.get(element.city.id)) ? citiesWithOffset.get(element.city.id) : -10
          });
        }
      }
      i++;
    });
    if (rest !== 0) {
      chartData.push({
        key: "Ostali",
        value: rest,
      });
    }
    this.setState({
      chartData: chartData,
      cityCount: data.length,
      cityMapData: cityMapData
    })
  }

  setHeatMapData(data) {
    let heatMapData = new Map();
    data.forEach(geography => {
      heatMapData.set(geography.id, {
        adPercent: geography.adPercent,
        averagePriceRSD: parseInt(geography.averagePriceRSD, 10),
        adCount: geography.adCount,
        numberOfSellers: geography.numberOfSellers,
        priceSumRSD: geography.priceSumRSD,
      })
    });
    this.setState({
      heatMapData: heatMapData,
      disableOptimization: true
    }, () => {
      this.setState({
        disableOptimization: false
      })
    })
  }

  getDataForTable(data, isMunicipality) {
    let regionDataForTable = [];
    if (isDefined(data)) {
      data.forEach(geography => {
        if ((!isMunicipality && isDefined(this.state.staticRegionData.get(geography.id))) ||
          (isMunicipality && isDefined(this.state.staticMunicipalityData.get(geography.id)))) {
          regionDataForTable.push({
            id: geography.id,
            regionId: isMunicipality ? this.state.staticMunicipalityData.get(geography.id).regionId : "",
            name: isMunicipality ? this.state.staticMunicipalityData.get(geography.id).name : this.state.staticRegionData.get(geography.id).name,
            adCount: geography.adCount,
            averagePriceRSD: parseInt(geography.averagePriceRSD, 10),
            numberOfSellers: geography.numberOfSellers,
            priceSumRSD: geography.priceSumRSD,
            population: isMunicipality ? this.state.staticMunicipalityData.get(geography.id).population : this.state.staticRegionData.get(geography.id).population,
            totalNumberOfSellers: isMunicipality ? this.state.staticMunicipalityData.get(geography.id).numberOfSellers : this.state.staticRegionData.get(geography.id).numberOfSellers,
          })
          regionDataForTable.sort((a, b) => a.name > b.name ? 1 : -1);
        }
      });
    }
    return regionDataForTable;
  }

  getCityDataForTable(cityData) {
    let cityDataForTable = [];

    if (isDefined(cityData)) {
      cityData.forEach(city => {
        cityDataForTable.push({
          municipalityId: city.city.municipalityId,
          regionId: city.city.regionId,
          name: city.city.cityName,
          adCount: city.adCount,
          averagePriceRSD: parseInt(city.averagePriceRSD, 10),
          numberOfSellers: city.numberOfSellers,
          priceSumRSD: city.priceSumRSD,
          population: city.city.population,
          totalNumberOfSellers: ""
        })
      });
    }

    return cityDataForTable;
  }

  getInfoForTable() {

    var startDate = moment(moment(this.state.startDate).add(this.state.intervalStartDate, 'days')._d).format("YYYY-MM-DD");
    var endDate = moment(moment(this.state.startDate).add(this.state.intervalStartDate, 'days').add(this.state.interval - 1, 'days')._d).format("YYYY-MM-DD");

    let infoForTable = {
      adCount: this.state.adsSummaryData.adCount,
      valueOfAds: this.state.adsSummaryData.valueOfAds,
      timePeriod: this.state.adsSummaryData.timePeriod,
      searchTerm: this.state.searchTerm,
      categoryName: this.state.categoryId === 0 ? "Sve" : this.state.categoryMap.get(this.state.categoryId).name,
      subcategoryName: this.state.subcategoryId === 0 ? "Sve" : this.state.categoryMap.get(this.state.categoryId).subcategoryMap.get(this.state.subcategoryId).name,
      startDate: moment(startDate)._i,
      endDate: moment(endDate)._i,
      priceLow: this.state.priceLow,
      priceHigh: this.state.priceHigh,
      normalizedByPopulation: this.state.normalizePopulation ? "DA" : "NE",
      normalizedBySellers: this.state.normalizeSellers ? "DA" : "NE",
      dedup: this.state.dedup ? "DA" : "NE"
    }

    return infoForTable;
  }

  receiveAdsSummary(data) {
    this.setState({
      adsSummaryData: {
        adCount: data.adCount,
        valueOfAds: data.priceSumRSD,
        timePeriod: data.days,
      }
    })
  }

  receiveCityDataAll(data) {
    this.setState({
      cityDataAll: data,
    })
    this.setCityData(data[0], cityZoom[this.state.zoomIndex]);
  }

  receiveRegionDataAll(data) {
    this.setState({
      regionDataAll: data.heat,
      regionDataBreakpoints: data.breakpoints,
      heatMapBreakpoints: data.breakpoints
    })
    if (this.state.isRegionShown) {
      this.setHeatMapData(data.heat[0]);
    }
  }

  receiveMunicipalityDataAll(data) {
    this.setState({
      municipalityDataAll: data.heat,
      municipalityDataBreakpoints: data.breakpoints,
    })
    if (!this.state.isRegionShown) {
      this.setHeatMapData(data.heat[0]);
    }
  }

  receiveStaticRegionData(data) {

    let staticRegionData = new Map();
    data.forEach(region => {
      staticRegionData.set(region.locationId, region);
    });

    this.setState({
      staticRegionData: staticRegionData
    });
  }

  receiveStaticMunicipalityData(data) {
    let staticMunicipalityData = new Map();
    data.forEach(municipality => {
      staticMunicipalityData.set(municipality.locationId, municipality);
    });
    this.setState({
      staticMunicipalityData: staticMunicipalityData
    });
  }

  getAdsSummary() {
    return axios({
      method: 'post',
      url: SERVER_ADDRESS + API_GET_ADS_SUMMARY,
      data: {
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        priceLow: this.state.priceLow,
        priceHigh: this.state.priceHigh,
        searchTerm: this.state.searchTerm,
        categoryId: this.state.subcategoryId === 0 ? this.state.categoryId : this.state.subcategoryId,
        dedup: this.state.dedup,
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getAds() {
    return axios({
      method: 'post',
      url: SERVER_ADDRESS + API_GET_ADS,
      data: {
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        priceLow: this.state.priceLow,
        priceHigh: this.state.priceHigh,
        searchTerm: this.state.searchTerm,
        categoryId: this.state.subcategoryId === 0 ? this.state.categoryId : this.state.subcategoryId,
        interval: this.state.interval,
        dedup: this.state.dedup,
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getRegionHeat(isMunicipality) {
    let url = "";
    if (isMunicipality) {
      url = SERVER_ADDRESS + API_GET_MUNICIPALITY_HEAT;
    } else {
      url = SERVER_ADDRESS + API_GET_REGION_HEAT;
    }
    return axios({
      method: 'post',
      url: url,
      data: {
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        priceLow: this.state.priceLow,
        priceHigh: this.state.priceHigh,
        searchTerm: this.state.searchTerm,
        categoryId: this.state.subcategoryId === 0 ? this.state.categoryId : this.state.subcategoryId,
        normalize: this.getNormalizeParameter(),
        interval: this.state.interval,
        dedup: this.state.dedup,
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getCategories() {
    var updateCategories = this.updateCategories;

    axios({
      method: 'get',
      url: SERVER_ADDRESS + API_GET_CATEGORIES,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        updateCategories(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {

      });
  }

  getStaticRegionData() {
    var receiveStaticRegionData = this.receiveStaticRegionData;
    axios({
      method: 'get',
      url: SERVER_ADDRESS + API_GET_STATIC_REGION_DATA,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        receiveStaticRegionData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {

      });
  }

  getStaticMunicipalityData() {
    var receiveMunicipalityData = this.receiveStaticMunicipalityData;
    axios({
      method: 'get',
      url: SERVER_ADDRESS + API_GET_STATIC_MUNICIPALITY_DATA,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        receiveMunicipalityData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {

      });
  }

  updateCategories(data) {
    let categoryMap = new Map();

    data.forEach(category => {
      let subcategoryMap = new Map();
      category.subcategories.forEach(subcategory => {
        subcategoryMap.set(subcategory.id, {
          name: subcategory.name,
        })
      });

      categoryMap.set(category.id, {
        name: category.name,
        subcategoryMap: subcategoryMap,
      })
    });

    this.setState({
      categoryMap: categoryMap,
    });
  }

  sendRequest() {
    var receiveAdsSummary = this.receiveAdsSummary;
    var receiveCityDataAll = this.receiveCityDataAll;
    var receiveRegionDataAll = this.receiveRegionDataAll;
    var receiveMunicipalityDataAll = this.receiveMunicipalityDataAll;
    var hideProgressBar = this.hideProgressBar;

    axios.all([this.getAdsSummary(), this.getAds(0), this.getRegionHeat(false), this.getRegionHeat(true)])
      .then(axios.spread(function (adsSummaryData, adsData, regionData, municipalityData) {
        receiveAdsSummary(adsSummaryData.data);
        receiveCityDataAll(adsData.data);
        receiveRegionDataAll(regionData.data);
        receiveMunicipalityDataAll(municipalityData.data);
        hideProgressBar();
      }))
      .catch(function (error) {
        console.log(error);
        hideProgressBar();
      })
  }



  hideProgressBar() {
    this.setState({
      inProgress: false,
    })
  }

  getNormalizeParameter() {
    if (this.state.normalizePopulation) {
      return 1;
    }

    if (this.state.normalizeSellers) {
      return 2;
    }

    return 0;
  }

  render() {
    return (
      <div md={{ size: 11, order: 2, offset: 1 }} className={classes.Container}>
        <Row>
          <Col md={{ size: 8, order: 2, offset: 0 }}>
            <Nav tabs>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggleTabs('1'); }}>
                  <Translate id="tabs.map" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggleTabs('2'); }}>
                  <Translate id="tabs.chart" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this.toggleTabs('3'); }}>
                  <Translate id="tabs.table" />
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1" className={classes.MapContainer}>
                <div className={classes.HeatmapLegend}>
                  <HeatmapLegend
                    breakpoints={this.state.heatMapBreakpoints}
                    normalizePopulation={this.state.normalizePopulation}
                    normalizeSellers={this.state.normalizeSellers}
                  />
                </div>
                <KpMap cityMapData={this.state.cityMapData}
                  heatMapData={this.state.heatMapData}
                  cityCount={this.state.cityCount}
                  zoomIndex={this.state.zoomIndex}
                  handleZoomChange={this.handleZoomChange}
                  setCityDataForGeography={this.setCityDataForGeography}
                  isRegionShown={this.state.isRegionShown}
                  disableOptimization={this.state.disableOptimization}
                  sendRequest={this.sendRequest}
                  staticRegionData={this.state.staticRegionData}
                  staticMunicipalityData={this.state.staticMunicipalityData} />
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Chart chartData={this.state.chartData}></Chart>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                  <Table
                    regionData={this.getDataForTable(this.state.regionDataAll[this.state.intervalStartDate], false)}
                    municipalityData={this.getDataForTable(this.state.municipalityDataAll[this.state.intervalStartDate], true)}
                    cityData={this.getCityDataForTable(this.state.cityDataAll[this.state.intervalStartDate])}
                    info={this.getInfoForTable()}
                  >
                  </Table>
                </Row>
              </TabPane>
            </TabContent>
          </Col>
          <Col md={{ size: 4, order: 2, offset: 0 }} >
            {
              this.state.inProgress === true ?
                <Row className={classes.CircularProgressContainer}>
                  <CircularProgress className={classes.CircularProgress} />
                </Row>
                :
                <div className={classes.Toolbox}>
                  <Col md={{ size: 12 }}><div className={classes.Title}><Translate id="dataSummary.title" /></div></Col>
                  <DataSummary
                    adsSummaryData={this.state.adsSummaryData}>
                  </DataSummary>
                  <Col md={{ size: 12 }}><div className={classes.Title}><Translate id="searchField.title" /></div></Col>
                  <SearchField
                    handleSearch={this.handleSearch}
                    handleKeyPressSearch={this.handleKeyPressSearch}
                    handleSubmitSearch={this.handleSubmitSearch}
                    searchTerm={this.state.searchTerm}>
                  </SearchField>
                  <Col md={{ size: 12 }}><div className={classes.Title}><Translate id="categorySelect.title" /></div></Col>
                  <CategorySelect
                    handleCategorySelect={this.handleCategorySelect}
                    categoryMap={this.state.categoryMap}
                    categoryId={this.state.categoryId}
                    subcategoryId={this.state.subcategoryId}>
                  </CategorySelect>
                  <Col md={{ size: 12 }}><div className={classes.Title}><Translate id="dateSpan.title" /></div></Col>
                  <DateSpan
                    handleDatesChange={this.handleDatesChange}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}>
                  </DateSpan>
                  <RangeSlider
                    minDate={this.state.startDate}
                    maxDays={this.state.maxDays}
                    interval={this.state.interval}
                    handleIntervalChange={this.handleIntervalChange}
                    handleDateRange={this.handleDateRange}>
                  </RangeSlider>
                  <Col md={{ size: 12 }}><div className={classes.Title}><Translate id="priceRangeSelect.title" /></div></Col>
                  <PriceRangeSelect
                    priceLow={this.state.priceLow}
                    priceHigh={this.state.priceHigh}
                    handlePriceLowChange={this.handlePriceLowChange}
                    handlePriceHighChange={this.handlePriceHighChange}
                    sendRequest={this.sendRequest}
                    handleKeyPress={this.handleKeyPressPrice}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    searchTerm={this.state.searchTerm}
                    categoryId={this.state.subcategoryId === 0 ? this.state.categoryId : this.state.subcategoryId}
                    dedup={this.state.dedup} />
                  <Col md={{ size: 12 }}><div className={classes.Title}><Translate id="normalizeData.title" /></div></Col>
                  <OptionsSelect
                    handleNormalizeDataByPopulationToggle={this.handleNormalizeDataByPopulationToggle}
                    normalizePopulation={this.state.normalizePopulation}
                    handleNormalizeDataBySellersToggle={this.handleNormalizeDataBySellersToggle}
                    normalizeSellers={this.state.normalizeSellers}
                    handleDeduplicateData={this.handleDeduplicateData}
                    dedup={this.state.dedup}>
                  </OptionsSelect>
                </div>
            }
          </Col>
        </Row>
      </div>
    )
  }
}
export default KPMapContainer;