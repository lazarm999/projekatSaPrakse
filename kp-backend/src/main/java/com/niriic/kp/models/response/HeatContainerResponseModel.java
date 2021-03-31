package com.niriic.kp.models.response;

import java.util.List;

public class HeatContainerResponseModel {

	List<Double> breakpoints;
	List<List<HeatResponseModel>> heat;
	public List<Double> getBreakpoints() {
		return breakpoints;
	}
	public void setBreakpoints(List<Double> breakpoints) {
		this.breakpoints = breakpoints;
	}
	public List<List<HeatResponseModel>> getHeat() {
		return heat;
	}
	public void setHeat(List<List<HeatResponseModel>> heat) {
		this.heat = heat;
	}
	public HeatContainerResponseModel(List<Double> breakpoints, List<List<HeatResponseModel>> heat) {
		super();
		this.breakpoints = breakpoints;
		this.heat = heat;
	}
	
}
