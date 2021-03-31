package com.niriic.kp.models.request;

import java.util.Date;

public class DateRequestModel {
	
	Date startDate, endDate;
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

	public Boolean getDedup() {
		return dedup;
	}

	public void setDedup(Boolean dedup) {
		this.dedup = dedup;
	}
	
	
	
}
