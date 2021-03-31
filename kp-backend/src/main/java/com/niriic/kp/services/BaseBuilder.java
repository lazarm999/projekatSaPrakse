package com.niriic.kp.services;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class BaseBuilder {

	protected String convertDate(Date date) {
		DateFormat df = new SimpleDateFormat("yyyy/MM/dd");
		return df.format(date);
	}
	
}
