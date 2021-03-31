package com.niriic.kp.models.response;

import java.util.List;

public class CategoryResponseModel {

	int id;
	String name;
	List<CategoryResponseModel> subcategories;
	
	public CategoryResponseModel(int id, String name, List<CategoryResponseModel> subcategories) {
		super();
		this.id = id;
		this.name = name;
		this.subcategories = subcategories;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<CategoryResponseModel> getSubcategories() {
		return subcategories;
	}
	public void setSubcategories(List<CategoryResponseModel> subcategories) {
		this.subcategories = subcategories;
	}
	
	
}
