package com.niriic.kp.models.request;

import java.util.Date;

public class CityAdsRequestModel {

	Date startDate, endDate;
	String searchTerm;
	int categoryId, interval, priceLow, priceHigh;
	Boolean dedup;

	public Boolean isValid() {
		if (startDate == null || endDate == null) return false;
		if (endDate.getTime() < startDate.getTime()) return false;
		if (priceHigh < priceLow) return false;
		return true;
	}
	
	public int getPriceLow() {
		return priceLow;
	}

	public void setPriceLow(int priceLow) {
		this.priceLow = priceLow;
	}

	public int getPriceHigh() {
		return priceHigh;
	}

	public void setPriceHigh(int priceHigh) {
		this.priceHigh = priceHigh;
	}

	public int getInterval() {
		return interval;
	}

	public void setInterval(int interval) {
		this.interval = interval;
	}

	public String getSearchTerm() {
		return searchTerm;
	}

	public void setSearchTerm(String searchTerm) {
		this.searchTerm = searchTerm;
	}

	public Date getStartDate() {
		return startDate;
	}

	public int getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Boolean getDedup() {
		return dedup;
	}

	public void setDedup(Boolean dedup) {
		this.dedup = dedup;
	}
}
