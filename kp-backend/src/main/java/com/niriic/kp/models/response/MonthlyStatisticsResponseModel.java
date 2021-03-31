package com.niriic.kp.models.response;

public class MonthlyStatisticsResponseModel {

	String dateRange;
	double averagePriceRSD;
	long adCount;
	
	public String getDateRange() {
		return dateRange;
	}
	public void setDateRange(String dateRange) {
		this.dateRange = dateRange;
	}
	public double getAveragePriceRSD() {
		return averagePriceRSD;
	}
	public void setAveragePriceRSD(double averagePriceRSD) {
		this.averagePriceRSD = averagePriceRSD;
	}
	public long getAdCount() {
		return adCount;
	}
	public void setAdCount(long adCount) {
		this.adCount = adCount;
	}
	public MonthlyStatisticsResponseModel(String dateRange, double averagePriceRSD, long adCount) {
		super();
		this.dateRange = dateRange;
		this.averagePriceRSD = averagePriceRSD;
		this.adCount = adCount;
	}
	
}
