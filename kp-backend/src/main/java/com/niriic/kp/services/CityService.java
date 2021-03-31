package com.niriic.kp.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.aggregations.bucket.terms.ParsedLongTerms;
import org.elasticsearch.search.aggregations.bucket.terms.Terms.Bucket;
import org.elasticsearch.search.aggregations.metrics.avg.ParsedAvg;
import org.elasticsearch.search.aggregations.metrics.cardinality.ParsedCardinality;
import org.elasticsearch.search.aggregations.metrics.sum.ParsedSum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.niriic.kp.models.City;
import com.niriic.kp.models.response.CityAdsResponseModel;

@Service
public class CityService {

	@Autowired
	HelperService helperService;
	
	@Autowired
	LocationService locationService;
	
	public List<List<CityAdsResponseModel>> getCityHeatInterval(Date startDate, Date endDate, int interval, 
			String searchTerm, int categoryId, int priceLow, int priceHigh, Boolean dedup) throws IOException {
		List<List<CityAdsResponseModel>> result = new ArrayList<>();
		
		Calendar csd = Calendar.getInstance(), ced = Calendar.getInstance(), end = Calendar.getInstance();
		ced.setTime(startDate);
		ced.add(Calendar.DATE, interval-1);
		csd.setTime(startDate);
		end.setTime(endDate);
		
		while (ced.get(Calendar.YEAR) != end.get(Calendar.YEAR) || ced.get(Calendar.MONTH) != end.get(Calendar.MONTH) || ced.get(Calendar.DATE) != end.get(Calendar.DATE)) {
			result.add(getCityHeat(csd.getTime(), ced.getTime(), searchTerm, categoryId, priceLow, priceHigh, dedup));
			csd.add(Calendar.DATE, 1);
			ced.add(Calendar.DATE, 1);
		}
		result.add(getCityHeat(csd.getTime(), ced.getTime(), searchTerm, categoryId, priceLow, priceHigh, dedup));
		return result;
	}
	
	public List<CityAdsResponseModel> getCityHeat(Date startDate, Date endDate, String searchTerm, int categoryId, int priceLow,
			int priceHigh, Boolean dedup) throws IOException {
		List<CityAdsResponseModel> result = new ArrayList<>();
		
		SearchResponse response = locationService.getAds(startDate, endDate, searchTerm, categoryId, priceLow, priceHigh, dedup);
		
		ParsedLongTerms aggregations = response.getAggregations().get("group_by_l");
		List<? extends Bucket> buckets = aggregations.getBuckets();
		Map<Integer, City> cities = helperService.getCities();
		
		for (Bucket b : buckets) {
			long priceSum = Math.round(((ParsedSum)b.getAggregations().get("sum")).getValue());
			double averagePriceRSD = ((ParsedAvg)b.getAggregations().get("average")).getValue();
			long numberOfSellers = ((ParsedCardinality)b.getAggregations().get("distinct_u")).getValue();
			result.add(new CityAdsResponseModel(cities.get(Math.toIntExact((long)b.getKey())), b.getDocCount(), priceSum, averagePriceRSD, numberOfSellers));
		}
		
		result.sort(new Comparator<CityAdsResponseModel>() {

			@Override
			public int compare(CityAdsResponseModel o1, CityAdsResponseModel o2) {
				return o1.getCity().getPopulation() < o2.getCity().getPopulation() ? 1 : -1;
			}
			
		});
		
		return result;
	}
	
}
