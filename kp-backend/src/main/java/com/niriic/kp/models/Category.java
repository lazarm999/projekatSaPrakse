package com.niriic.kp.models;

public class Category {
	
	int parent;
	String name;
	
	public Category(int parent, String name) {
		super();
		this.parent = parent;
		this.name = name;
	}
	
	public int getParent() {
		return parent;
	}
	
	public void setParent(int parent) {
		this.parent = parent;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
}
