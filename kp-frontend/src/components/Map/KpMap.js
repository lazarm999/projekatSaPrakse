import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps"
import ReactTooltip from 'react-tooltip'
import { Translate } from "react-localize-redux";
import { scaleLinear } from "d3-scale"
import { geoPath } from "d3-geo"
import { geoTimes } from "d3-geo-projection"
import classNames from 'classnames';
import WheelReact from 'wheel-react';
import { Motion, spring } from 'react-motion'
import { FaCrosshairs } from 'react-icons/fa';
import { Button } from "reactstrap";
import GeographyDetailsModal from '../GeographyDetailsModal/GeographyDetailsModal';
import { isEmpty, isDefined, preventDefault } from '../../constants/functions'
import colors from '../../css/colors.css';
import classes from './KpMap.css'

const zoomScale = [1, 2.2, 5.9, 10.5, 14.5, 18, 40, 50, 70, 130];
var geographyZoom = false;

const heatScale = scaleLinear()
  .domain([0, 1])
  .range(["#FFFFFF", "#284a88"]);

function func(s) {
  if (s === "hover") {
    return 5;
  }
  return 0.75;
}

class KpMap extends Component {

  constructor(props) {
    super(props)
    this.state = {
      width: 1200,
      height: 700,
      center: [0, 0],
      zoom: 1,
      isModalShown: false,
      selectedGeography: {},
      bypass: false,
      isPanningDisabled: false,
      isZoomDisabled: false
    }
    this.disableScroll = this.disableScroll.bind(this);
    this.enableScroll = this.enableScroll.bind(this);
    this.handleZoomChange = this.handleZoomChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleMoveStart = this.handleMoveStart.bind(this);
    this.handleMoveEnd = this.handleMoveEnd.bind(this);
    this.handleGeographyClick = this.handleGeographyClick.bind(this);
    this.centerGeography = this.centerGeography.bind(this);
    this.projection = this.projection.bind(this);
    this.handleCenterButtonClick = this.handleCenterButtonClick.bind(this);

    WheelReact.config({
      up: () => {
        this.handleZoomChange(-1);
      },
      down: () => {
        this.handleZoomChange(1);
      }
    });
  }

  componentDidMount() {
    setTimeout(() => {
      ReactTooltip.rebuild()
    }, 500)

    setTimeout(() => {
      this.setState({
        center: [20.795577, 44.032121],
      })
    }, 1);
  }

  componentDidUpdate() {
    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 500);
  }

  disableScroll() {
    if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', preventDefault, false);
    }
    window.onwheel = preventDefault;
    window.onmousewheel = document.onmousewheel = preventDefault;
    window.ontouchmove = preventDefault;
  }

  enableScroll() {
    if (window.removeEventListener) {
      window.removeEventListener('DOMMouseScroll', preventDefault, false);
    }
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
  }

  handleZoomChange(value) {

    if (geographyZoom) {
      geographyZoom = false;
      if (value > 0) {
        for (var i = 0; i < zoomScale.length; i++) {
          if (zoomScale[i] > this.state.zoom) {
            value = i - this.props.zoomIndex;
            break;
          }
        }
      } else {
        for (i = zoomScale.length - 1; i >= 0; i--) {
          if (zoomScale[i] < this.state.zoom) {
            value = i - this.props.zoomIndex;
            break;
          }
        }
      }
    }

    if (!this.state.isZoomDisabled) {
      if ((this.props.zoomIndex < zoomScale.length - 1 && this.props.zoomIndex > 0) ||
        (this.props.zoomIndex === zoomScale.length - 1 && value < 0) ||
        (this.props.zoomIndex === 0 && value > 0)) {
        this.props.handleZoomChange(value);
      }
    }
  }

  closeModal() {
    this.setState({
      isModalShown: !this.state.isModalShown,
      isZoomDisabled: false
    });
  }

  openModal(geographyData) {
    clearInterval(this.timer);
    this.timer = null;

    this.setState({
      isModalShown: !this.state.isModalShown,
      selectedGeography: geographyData,
      isZoomDisabled: true
    });
  }

  handleMoveStart(newCenter) {
    this.setState({
      center: newCenter,
      bypass: true,
    })
  }

  handleMoveEnd(newCenter) {
    this.setState({
      center: newCenter,
      bypass: JSON.stringify(newCenter) !== JSON.stringify(this.state.center),
    })
  }

  handleGeographyClick(geography, geographyData) {
    if (this.state.bypass) return;

    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
      this.centerGeography(geography);
    } else {
      this.timer = setInterval(() => this.openModal(geographyData), 300);
    }
  }

  handleCenterButtonClick() {
    geographyZoom = false;
    this.setState({
      center: [20.795577, 44.032121],
      isPanningDisabled: false
    })
    this.props.handleZoomChange(-1 * (this.props.zoomIndex));
  }

  centerGeography(geography) {
    const path = geoPath().projection(this.projection());
    const centroid = this.projection().invert(path.centroid(geography));

    const bounds = path.bounds(geography);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const zoom = 0.9 / Math.max(dx / this.state.width, dy / this.state.height);

    geographyZoom = true;

    this.setState({
      center: centroid,
      zoom: zoom,
    })

    let geographyId = geography.properties.id;
    this.props.setCityDataForGeography(geographyId);
  }

  isGeographyDefined(geographyId) {
    return isDefined(this.props.heatMapData) && isDefined(this.props.heatMapData.get(geographyId));
  }

  projection() {
    return geoTimes()
      .translate([this.state.width / 2, this.state.height / 2])
      .scale(12000)
  }

  render() {
    let mapPath = "";

    if (!this.props.isRegionShown) {
      mapPath = process.env.PUBLIC_URL + "/static/sr_municipality.json";
    } else {
      mapPath = process.env.PUBLIC_URL + "/static/sr_kos_regional.json";
    }

    var geographyDetailsModal = "";
    if (!isEmpty(this.state.selectedGeography)) {
      geographyDetailsModal = <GeographyDetailsModal selectedGeography={this.state.selectedGeography} isShown={this.state.isModalShown}
        close={this.closeModal} isRegionShown={this.props.isRegionShown} />
    }

    return (
      <div
        className={classes.MapWrapper}
        {...WheelReact.events}
        onMouseEnter={this.disableScroll}
        onMouseLeave={this.enableScroll} >

        {geographyDetailsModal}

        <Translate>
          {
            ({ translate }) =>
              <Motion
                defaultStyle={{
                  zoom: 1,
                }}
                style={{
                  zoom: spring(geographyZoom ? this.state.zoom : zoomScale[this.props.zoomIndex], { stiffness: 150, damping: 25 })
                }}>
                {({ zoom }) => (
                  <ComposableMap
                    width={this.state.width}
                    height={this.state.height}
                    className={classes.ComposableMap}
                    projection={this.projection}>
                    <ZoomableGroup
                      center={this.state.center}
                      zoom={zoom <= 0 ? 1 : zoom}
                      onMoveStart={this.handleMoveStart}
                      onMoveEnd={this.handleMoveEnd}
                      disablePanning={this.state.isPanningDisabled}>
                      <Geographies
                        geography={mapPath}
                        disableOptimization={this.props.disableOptimization}>
                        {(geographies, projection) => geographies.map((geography, i) => {
                          var dataForTooltip = "", dataForHeatScale = "";
                          var geographyData = {
                            id: -1,
                            adCount: 0,
                            adPercent: 0,
                            averagePriceRSD: 0,
                            numberOfSellers: 0,
                            totalNumberOfSellers: 0,
                            population: 0
                          };

                          if (this.props.isRegionShown) {
                            if (geography.properties.id === 836) {
                              dataForTooltip = "Grad Beograd";
                            } else {
                              dataForTooltip = translate("map.region", { name: geography.properties.name });
                            }
                          } else {
                            dataForTooltip = translate("map.municipality", { name: geography.properties.name });
                          }

                          if (this.isGeographyDefined(geography.properties.id)) {
                            geographyData = this.props.heatMapData.get(geography.properties.id);
                            geographyData.id = geography.properties.id;
                           
                            if (this.props.isRegionShown) {
                              if(isDefined(this.props.staticRegionData.get(geography.properties.id))) {
                                geographyData.population = this.props.staticRegionData.get(geography.properties.id).population;
                                geographyData.totalNumberOfSellers = this.props.staticRegionData.get(geography.properties.id).numberOfSellers;
                              }
                            } else {
                              if(isDefined(this.props.staticMunicipalityData.get(geography.properties.id))) {
                                geographyData.population = this.props.staticMunicipalityData.get(geography.properties.id).population;
                                geographyData.totalNumberOfSellers = this.props.staticMunicipalityData.get(geography.properties.id).numberOfSellers;
                              }
                            }
                          }
                          geographyData.name = geography.properties.name;
                          dataForHeatScale = geographyData.adPercent;
                          dataForTooltip += " (" + geographyData.adCount + ")";
                          return (
                            <Geography
                              data-tip={dataForTooltip}
                              onClick={() => this.handleGeographyClick(geography, geographyData)}
                              key={i}
                              geography={geography}
                              projection={projection}
                              style={{
                                default: {
                                  fill: heatScale(dataForHeatScale),
                                  stroke: "#607D8B",
                                  strokeWidth: func("default"),
                                  outline: "none",
                                },
                                hover: {
                                  fill: heatScale(dataForHeatScale),
                                  stroke: "#607D8B",
                                  strokeWidth: func("hover"),
                                  outline: "none",
                                },
                                pressed: {
                                  fill: "#FF5722",
                                  stroke: "#607D8B",
                                  strokeWidth: func("pressed"),
                                  outline: "none",
                                },
                              }}
                            >
                            </Geography>);
                        }
                        )}
                      </Geographies>
                      <Markers>
                        {this.props.cityMapData.map((city, i) => (
                          <Marker
                            key={i}
                            marker={city}
                            style={{
                              default: { fill: "#FF5722" },
                              hover: { fill: "#FFFFFF" },
                              pressed: { fill: "#FF5722" },
                            }}
                          >
                            <circle
                              cx={0}
                              cy={0}
                              r={3}
                              fill="rgba(255,87,34,0.8)"
                              stroke="#607D8B"
                              strokeWidth="2"
                            />
                            <text
                              data-tip={city.adCount}
                              textAnchor="middle"
                              y={city.markerOffset}
                              style={{
                                fontFamily: "Roboto, sans-serif",
                                fill: "#000000",
                              }}
                            >
                              {city.name}
                            </text>
                          </Marker>
                        ))}
                      </Markers>
                    </ZoomableGroup>
                  </ComposableMap>)}
              </Motion>
          }
        </Translate>
        <Button className={classNames(colors.primaryColor, classes.CenterButton)} onClick={this.handleCenterButtonClick}><FaCrosshairs style={{ width: "30px", height: "30px" }} /></Button>
        <ReactTooltip
          afterShow={() => { this.setState({ isPanningDisabled: false }) }}
          afterHide={() => { this.setState({ isPanningDisabled: true }) }}
        />
      </div>);
  }
}

export default KpMap;
