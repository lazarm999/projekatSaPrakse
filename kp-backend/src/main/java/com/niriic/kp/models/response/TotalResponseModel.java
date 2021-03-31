package com.niriic.kp.models.response;

public class TotalResponseModel {
	long adCount, days, priceSumRSD;
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
	
	public long getDays() {
		return days;
	}
	public void setDays(long days) {
		this.days = days;
	}
	public TotalResponseModel(long adCount, long priceSumRSD, long days) {
		super();
		this.adCount = adCount;
		this.priceSumRSD = priceSumRSD;
		this.days = days;
	}
	
	
}
