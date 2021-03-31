import React from 'react';
import { Translate } from "react-localize-redux";
import "./DetailsArea.css";
import { formatNumber } from "../../../constants/functions";

class DetailsArea extends React.Component {
    render() {
        return (
            <div>
                <h5>
                    <Translate id="map.selectedAdsSummary" />
                </h5>
                <ul>
                    <li><Translate id="map.adCount" /> {formatNumber(this.props.selectedGeography.adCount)}</li>
                    <li><Translate id="map.averagePriceRSD" /> {formatNumber(this.props.selectedGeography.averagePriceRSD)}</li>
                    <li><Translate id="map.numberOfSellers" /> {formatNumber(this.props.selectedGeography.numberOfSellers)}</li>
                </ul>
                <h5>
                    {this.props.isRegionShown ? <Translate id="map.selectedRegionSummary" /> : <Translate id="map.selectedMunicipalitySummary" />}
                </h5>
                <ul>
                    <li><Translate id="map.population" /> {formatNumber(this.props.selectedGeography.population)}</li>
                    <li><Translate id="map.numberOfSellers" /> {formatNumber(this.props.selectedGeography.totalNumberOfSellers)}</li>
                </ul>
            </div>
        );
    }
}

export default DetailsArea;