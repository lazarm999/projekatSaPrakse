package com.niriic.kp.models.response;

public class HeatResponseModel {

	int id, adCount, numberOfSellers;
	double adPercent, averagePriceRSD;
	long priceSumRSD;

	public HeatResponseModel(int id, double adPercent, double averagePriceRSD, int adCount, long priceSumRSD, int numberOfSellers) {
		super();
		this.id = id;
		this.adPercent = adPercent;
		this.averagePriceRSD = averagePriceRSD;
		this.adCount = adCount;
		this.priceSumRSD = priceSumRSD;
		this.numberOfSellers = numberOfSellers;
	}
	
	public int getAdCount() {
		return adCount;
	}

	public void setAdCount(int adCount) {
		this.adCount = adCount;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public double getAveragePriceRSD() {
		return averagePriceRSD;
	}

	public void setAveragePriceRSD(double averagePriceRSD) {
		this.averagePriceRSD = averagePriceRSD;
	}
	
	public double getAdPercent() {
		return adPercent;
	}
	
	public void setAdPercent(double adPercent) {
		this.adPercent = adPercent;
	}

	public long getPriceSumRSD() {
		return priceSumRSD;
	}

	public void setPriceSumRSD(long priceSumRSD) {
		this.priceSumRSD = priceSumRSD;
	}

	public int getNumberOfSellers() {
		return numberOfSellers;
	}

	public void setNumberOfSellers(int numberOfSellers) {
		this.numberOfSellers = numberOfSellers;
	}
	
	
}
