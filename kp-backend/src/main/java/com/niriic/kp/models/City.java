package com.niriic.kp.models;

public class City {

	int id;
	double lat, lng;
	String cityName;
	int population, regionId, municipalityId;

	public City(int id, double lat, double lng, String cityName, int population, int regionId, int municipalityId) {
		super();
		this.id = id;
		this.lat = lat;
		this.lng = lng;
		this.cityName = cityName;
		this.population = population;
		this.regionId = regionId;
		this.municipalityId = municipalityId;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getMunicipalityId() {
		return municipalityId;
	}

	public void setMunicipalityId(int municipalityId) {
		this.municipalityId = municipalityId;
	}
	
	public int getPopulation() {
		return population;
	}
	
	public void setPopulation(int population) {
		this.population = population;
	}

	public int getRegionId() {
		return regionId;
	}

	public void setRegionId(int regionId) {
		this.regionId = regionId;
	}

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	public double getLng() {
		return lng;
	}

	public void setLng(double lng) {
		this.lng = lng;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}
	
	
}
