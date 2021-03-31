package com.niriic.kp.models.response;

import java.util.List;

import com.niriic.kp.models.CategoryAdCount;

public class TopCategoryResponseModel {
	
	int id;
	List<CategoryAdCount> categories;
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}

	public List<CategoryAdCount> getCategories() {
		return categories;
	}
	
	public void setCategories(List<CategoryAdCount> categories) {
		this.categories = categories;
	}

	public TopCategoryResponseModel(int id, List<CategoryAdCount> categories) {
		super();
		this.id = id;
		this.categories = categories;
	}
	
}
