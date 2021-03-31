package com.niriic.kp.controllers;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.niriic.kp.models.request.CityAdsRequestModel;
import com.niriic.kp.models.response.CityAdsResponseModel;
import com.niriic.kp.services.CityService;

@CrossOrigin
@RestController
@RequestMapping("/api/city")
public class CityController {
	
	@Autowired
	CityService cityService;

	@RequestMapping(value="/ads", method=RequestMethod.POST)
	public ResponseEntity<?> getAds(@RequestBody CityAdsRequestModel model) throws IOException {
		if (!model.isValid()) return new ResponseEntity<>("Invalid data received", HttpStatus.BAD_REQUEST);
		
		List<List<CityAdsResponseModel>> response = null;
		Date startDate = model.getStartDate(), endDate = model.getEndDate();
		String searchTerm = model.getSearchTerm();
		int categoryId = model.getCategoryId(), interval = model.getInterval(), priceLow = model.getPriceLow(), priceHigh = model.getPriceHigh();
		Boolean dedup = model.getDedup() == null ? true : model.getDedup();
		
		response = cityService.getCityHeatInterval(startDate, endDate, interval, searchTerm, categoryId, priceLow, priceHigh, dedup);

		return new ResponseEntity<List<List<CityAdsResponseModel>>>(response, HttpStatus.OK);
	}
}
