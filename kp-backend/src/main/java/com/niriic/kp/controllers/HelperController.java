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

import com.niriic.kp.models.request.CountPerPriceRequestModel;
import com.niriic.kp.models.request.EmailRequestModel;
import com.niriic.kp.models.request.TotalRequestModel;
import com.niriic.kp.models.response.CategoryResponseModel;
import com.niriic.kp.models.response.CountPerPriceResponseModel;
import com.niriic.kp.models.response.TotalResponseModel;
import com.niriic.kp.services.HelperService;

@CrossOrigin
@RestController
@RequestMapping("/api/helper")
public class HelperController {

	@Autowired
	HelperService helperService;
	
	@RequestMapping(value="/categories", method=RequestMethod.GET)
	public ResponseEntity<?> getCategories() throws IOException {
		List<CategoryResponseModel> response = null;
		
		response = helperService.getCategoryList();
		return new ResponseEntity<List<CategoryResponseModel>>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value="/mail", method=RequestMethod.POST)
	public void sendMail(@RequestBody EmailRequestModel model) {
		helperService.sendEmail(model.getName(), model.getEmail(), model.getMessage());
	}
	
	@RequestMapping(value="/total", method=RequestMethod.POST)
	public ResponseEntity<?> getTotalInfo(@RequestBody TotalRequestModel model) throws IOException {
		TotalResponseModel response = null;
		
		Date startDate = model.getStartDate(), endDate = model.getEndDate();
		String searchTerm = model.getSearchTerm();
		int categoryId = model.getCategoryId(), priceLow = model.getPriceLow(), priceHigh = model.getPriceHigh();
		Boolean dedup = model.getDedup() == null ? true : model.getDedup();
		
		response = helperService.getTotalInfo(startDate, endDate, searchTerm, categoryId, priceLow, priceHigh, dedup);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@RequestMapping(value="/count-per-price", method=RequestMethod.POST)
	public ResponseEntity<?> getCountPerPrice(@RequestBody CountPerPriceRequestModel model) throws IOException {
		Date startDate = model.getStartDate(), endDate = model.getEndDate();
		String searchTerm = model.getSearchTerm();
		int categoryId = model.getCategoryId(), priceLow = model.getPriceLow(), priceHigh = model.getPriceHigh();
		Boolean dedup = model.getDedup() == null ? true : model.getDedup();
		
		CountPerPriceResponseModel response = helperService.getCountPerPrice(startDate, endDate, searchTerm, categoryId, priceLow, priceHigh, dedup);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
