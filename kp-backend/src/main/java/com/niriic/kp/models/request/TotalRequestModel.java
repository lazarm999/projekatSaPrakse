package com.niriic.kp.models.request;

import java.util.Date;

public class TotalRequestModel {
	Date startDate, endDate;
	String searchTerm;
	int categoryId, priceLow, priceHigh;
	Boolean dedup;
	
	public Date getStartDate() {
		return startDate;
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
	public String getSearchTerm() {
		return searchTerm;
	}
	public void setSearchTerm(String searchTerm) {
		this.searchTerm = searchTerm;
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
	public Boolean getDedup() {
		return dedup;
	}
	public void setDedup(Boolean dedup) {
		this.dedup = dedup;
	}
	
	
}
