package com.niriic.kp.models.request;

public class MonthlyStatisticsRequestModel {
	int locationId, categoryId, priceLow, priceHigh;
	String searchTerm;
	Boolean dedup;
	
	public int getLocationId() {
		return locationId;
	}
	public void setLocationId(int locationId) {
		this.locationId = locationId;
	}
	public int getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
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
	public String getSearchTerm() {
		return searchTerm;
	}
	public void setSearchTerm(String searchTerm) {
		this.searchTerm = searchTerm;
	}
	public Boolean getDedup() {
		return dedup;
	}
	public void setDedup(Boolean dedup) {
		this.dedup = dedup;
	}
	
	
}
