package com.niriic.kp.models.response;

import com.niriic.kp.models.City;

public class CityAdsResponseModel {

	City city;
	long adCount, priceSumRSD, numberOfSellers;
	double averagePriceRSD;

	public CityAdsResponseModel(City city, long adCount, long priceSumRSD, double averagePriceRSD, long numberOfSellers) {
		super();
		this.city = city;
		this.adCount = adCount;
		this.priceSumRSD = priceSumRSD;
		this.averagePriceRSD = averagePriceRSD;
		this.numberOfSellers = numberOfSellers;
	}
	
	public City getCity() {
		return city;
	}

	public void setCity(City city) {
		this.city = city;
	}

	public long getAdCount() {
		return adCount;
	}
	
	public void setAdCount(long adCount) {
		this.adCount = adCount;
	}

	public long getPriceSumRSD() {
		return priceSumRSD;
	}

	public void setPriceSumRSD(long priceSumRSD) {
		this.priceSumRSD = priceSumRSD;
	}

	public long getNumberOfSellers() {
		return numberOfSellers;
	}

	public void setNumberOfSellers(long numberOfSellers) {
		this.numberOfSellers = numberOfSellers;
	}

	public double getAveragePriceRSD() {
		return averagePriceRSD;
	}

	public void setAveragePriceRSD(double averagePriceRSD) {
		this.averagePriceRSD = averagePriceRSD;
	}
	
	
}
