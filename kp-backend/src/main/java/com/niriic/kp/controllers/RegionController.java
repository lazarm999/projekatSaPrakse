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

import com.niriic.kp.models.enums.Normalization;
import com.niriic.kp.models.request.DateRequestModel;
import com.niriic.kp.models.request.HeatRequestModel;
import com.niriic.kp.models.request.MonthlyStatisticsRequestModel;
import com.niriic.kp.models.response.HeatContainerResponseModel;
import com.niriic.kp.models.response.MonthlyStatisticsResponseModel;
import com.niriic.kp.models.response.TopCategoryResponseModel;
import com.niriic.kp.services.RegionService;

@CrossOrigin
@RestController
@RequestMapping("/api/region")
public class RegionController {
	
	@Autowired
	RegionService regionService;
	
	@RequestMapping(value="/data", method=RequestMethod.GET)
	public ResponseEntity<?> getStaticRegionData() throws IOException {
		return new ResponseEntity<>(regionService.getStaticRegionData(), HttpStatus.OK);
	}
	
	@RequestMapping(value="/heat", method=RequestMethod.POST)
	public ResponseEntity<?> getRegionHeat(@RequestBody HeatRequestModel model) throws IOException {
		if (!model.isValid()) return new ResponseEntity<>("Invalid data received", HttpStatus.BAD_REQUEST);
		
		HeatContainerResponseModel response = null;
		Date startDate = model.getStartDate(), endDate = model.getEndDate();
		String searchTerm = model.getSearchTerm() == null ? "" : model.getSearchTerm();
		int categoryId = model.getCategoryId(), interval = model.getInterval(), priceLow = model.getPriceLow(), priceHigh = model.getPriceHigh();
		Normalization normalize = model.getNormalize() == null ? Normalization.NONE : model.getNormalize();
		Boolean dedup = model.getDedup() == null ? true : model.getDedup();
		
		response = regionService.getRegionHeatInterval(startDate, endDate, interval, searchTerm, categoryId, normalize, priceLow, priceHigh, dedup);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@RequestMapping(value="/top-categories", method=RequestMethod.POST)
	public ResponseEntity<?> getRegionHeat(@RequestBody DateRequestModel model) throws IOException {
		
		List<TopCategoryResponseModel> response = null;
		Date startDate = model.getStartDate(), endDate = model.getEndDate();
		Boolean dedup = model.getDedup() == null ? true : model.getDedup();

		response = regionService.getRegionTopCategories(startDate, endDate, dedup);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value="/monthly", method=RequestMethod.POST)
	public ResponseEntity<?> getRegionMonthlyStatistics(@RequestBody MonthlyStatisticsRequestModel model) throws IOException {
		int locationId = model.getLocationId(), categoryId = model.getCategoryId(), priceLow = model.getPriceLow(), priceHigh = model.getPriceHigh();
		String searchTerm = model.getSearchTerm();
		Boolean dedup = model.getDedup() == null ? true : model.getDedup();
		
		List<MonthlyStatisticsResponseModel> response = regionService.getRegionMonthlyStatistics(locationId, categoryId, searchTerm, priceLow, priceHigh, dedup);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
