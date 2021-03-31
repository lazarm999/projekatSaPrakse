package com.niriic.kp.models;

public class CategoryAdCount {
	
	int categoryId;
	long adCount;

	public int getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}

	public long getAdCount() {
		return adCount;
	}

	public void setAdCount(long adCount) {
		this.adCount = adCount;
	}

	public CategoryAdCount(int categoryId, long adCount) {
		super();
		this.categoryId = categoryId;
		this.adCount = adCount;
	}
	
}
