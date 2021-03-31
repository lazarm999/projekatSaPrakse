package com.niriic.kp.models.response;

public class LocationResponseModel {
	int locationId, regionId, population, numberOfSellers;
	String name;
	
	public LocationResponseModel() {}
	public LocationResponseModel(int locationId, int regionId, int population, int numberOfSellers, String name) {
		super();
		this.locationId = locationId;
		this.regionId = regionId;
		this.population = population;
		this.numberOfSellers = numberOfSellers;
		this.name = name;
	}
	public int getLocationId() {
		return locationId;
	}
	public void setLocationId(int locationId) {
		this.locationId = locationId;
	}
	public int getRegionId() {
		return regionId;
	}
	public void setRegionId(int regionId) {
		this.regionId = regionId;
	}
	public int getPopulation() {
		return population;
	}
	public void setPopulation(int population) {
		this.population = population;
	}
	public int getNumberOfSellers() {
		return numberOfSellers;
	}
	public void setNumberOfSellers(int numberOfSellers) {
		this.numberOfSellers = numberOfSellers;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
}
