import React, { Component } from 'react';
import { Translate } from "react-localize-redux";
import ReactTooltip from 'react-tooltip'
import ColorLegend from './ColorLegend/ColorLegend'

class HeatmapLegend extends Component {
  render() {

    var normalizeString = "";
    if (this.props.normalizePopulation) {
      normalizeString = "byPopulation";
    } else if (this.props.normalizeSellers) {
      normalizeString = "bySellers";
    } else {
      normalizeString = "notNormalized";
    }

    var times = 0;
    var breakpoints = [];
    if (this.props.breakpoints.length !== 0) {

      if (normalizeString !== "notNormalized") {
        var breakpoint = this.props.breakpoints[0];
        var j = 0;
        times = 1;
        while (breakpoint.toString()[j] === "0" || breakpoint.toString()[j] === ".") {
          j++;
          times *= 10;
        }
      }

      for (var i = this.props.breakpoints.length - 1; i >= 0; i--) {
        breakpoint = this.props.breakpoints[i];
        if (normalizeString !== "notNormalized") {
          breakpoint *= times;
        }
        breakpoints.push(Math.round(breakpoint));
      }
      breakpoints.push(0);
    }

    return (
      <div>
        <div>
          <Translate id={"normalizeData.definition." + normalizeString} data={{ times: times }} />
        </div>
        <ColorLegend breakpoints={breakpoints} />
        <ReactTooltip />
      </div>
    );
  }
}

export default HeatmapLegend;
