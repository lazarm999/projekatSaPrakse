package com.niriic.kp.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.aggregations.bucket.range.ParsedDateRange;
import org.elasticsearch.search.aggregations.bucket.range.Range;
import org.elasticsearch.search.aggregations.bucket.terms.ParsedLongTerms;
import org.elasticsearch.search.aggregations.bucket.terms.Terms.Bucket;
import org.elasticsearch.search.aggregations.metrics.avg.ParsedAvg;
import org.elasticsearch.search.aggregations.metrics.cardinality.ParsedCardinality;
import org.elasticsearch.search.aggregations.metrics.sum.ParsedSum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.niriic.kp.models.CategoryAdCount;
import com.niriic.kp.models.City;
import com.niriic.kp.models.enums.Normalization;
import com.niriic.kp.models.response.HeatContainerResponseModel;
import com.niriic.kp.models.response.HeatResponseModel;
import com.niriic.kp.models.response.LocationResponseModel;
import com.niriic.kp.models.response.MonthlyStatisticsResponseModel;
import com.niriic.kp.models.response.TopCategoryResponseModel;

@Service
public class RegionService {

	@Autowired
	HelperService helperService;
	
	@Autowired
	LocationService locationService;
	
	public HeatContainerResponseModel getRegionHeatInterval(Date startDate, Date endDate, int interval,
			String searchTerm, int categoryId, Normalization normalize, int priceLow, int priceHigh, Boolean dedup) throws IOException {
		
		List<List<HeatResponseModel>> heat = new ArrayList<>();
		
		Calendar csd = Calendar.getInstance(), ced = Calendar.getInstance(), end = Calendar.getInstance();
		ced.setTime(startDate);
		ced.add(Calendar.DATE, interval-1);
		csd.setTime(startDate);
		end.setTime(endDate);
		
		while (ced.get(Calendar.YEAR) != end.get(Calendar.YEAR) || ced.get(Calendar.MONTH) != end.get(Calendar.MONTH) || ced.get(Calendar.DATE) != end.get(Calendar.DATE)) {
			heat.add(getRegionHeat(csd.getTime(), ced.getTime(), searchTerm, categoryId, normalize, priceLow, priceHigh, dedup));
			csd.add(Calendar.DATE, 1);
			ced.add(Calendar.DATE, 1);
		}
		heat.add(getRegionHeat(csd.getTime(), ced.getTime(), searchTerm, categoryId, normalize, priceLow, priceHigh, dedup));
		
		double max = 0;
		for (List<HeatResponseModel> l : heat) {
			for (HeatResponseModel h : l) {
				max = Math.max(max, h.getAdPercent());
			}
		}
		
		for (List<HeatResponseModel> l : heat) {
			for (HeatResponseModel h : l) {
				h.setAdPercent(h.getAdPercent()/max);
			}
		}
		
		List<Double> breakpoints = new ArrayList<>();
		for (int i = 1; i <= 10; i++) {
			breakpoints.add(i*max/10.0);
		}
		
		return new HeatContainerResponseModel(breakpoints, heat);
	}
	
	private List<HeatResponseModel> getRegionHeat(Date startDate, Date endDate, String searchTerm, int categoryId, Normalization normalize,
			int priceLow, int priceHigh, Boolean dedup) throws IOException {
		List<HeatResponseModel> result = new ArrayList<>();
		
		SearchResponse response = locationService.getAds(startDate, endDate, searchTerm, categoryId, priceLow, priceHigh, dedup);
		
		ParsedLongTerms aggregations = response.getAggregations().get("group_by_l");
		List<? extends Bucket> buckets = aggregations.getBuckets();
		Map<Integer, Integer> regionPopulation = new HashMap<>(), regionAdCount = new HashMap<>(), userCount = new HashMap<>();
		Map<Integer, Long> regionPriceSum = new HashMap<>();
		Map<Integer, City> cities = helperService.getCities();
		
		
		for (Bucket b : buckets) {
			int cityId = Math.toIntExact((long)b.getKey()), adCount = Math.toIntExact(b.getDocCount());
			int regionId = cities.get(cityId).getRegionId();
			
			regionPopulation.put(regionId, regionPopulation.getOrDefault(regionId, 0) + cities.get(cityId).getPopulation());
			regionAdCount.put(regionId, regionAdCount.getOrDefault(regionId, 0) + adCount);
			regionPriceSum.put(regionId, regionPriceSum.getOrDefault(regionId, 0l) + Math.round(((ParsedSum)b.getAggregations().get("sum")).getValue()));
			userCount.put(regionId, userCount.getOrDefault(regionId, 0) + ((Long)((ParsedCardinality)b.getAggregations().get("distinct_u")).getValue()).intValue());
		}
		
		Map<Integer, Double> normalizedRegionAdCount = new HashMap<>();
		for (Map.Entry<Integer, Integer> entry : regionAdCount.entrySet()) {
			double norm = 0;
			switch(normalize) {
				case NONE:
					norm = entry.getValue();
					break;
				case POPULATION:
					norm = 1.0*entry.getValue()/regionPopulation.get(entry.getKey());
					break;
				case SELLER:
					norm = 1.0*entry.getValue()/userCount.get(entry.getKey());
					break;
			}
			normalizedRegionAdCount.put(entry.getKey(), norm);
		}
		
		for (Map.Entry<Integer, Double> entry : normalizedRegionAdCount.entrySet()) {
			result.add(new HeatResponseModel(entry.getKey(),
					entry.getValue(),
					(1.0*regionPriceSum.get(entry.getKey()))/regionAdCount.get(entry.getKey()),
					regionAdCount.get(entry.getKey()),
					regionPriceSum.get(entry.getKey()),
					userCount.get(entry.getKey())));
		}
		
		return result;
	}
	
	public List<TopCategoryResponseModel> getRegionTopCategories(Date startDate, Date endDate, Boolean dedup) throws IOException {
		List<TopCategoryResponseModel> result = new ArrayList<>();
		
		SearchResponse response = locationService.getTopCategories(startDate, endDate, dedup);
		Map<Integer, City> cities = helperService.getCities();
		Map<Integer, Map<Integer, Long>> regions = new HashMap<>();
		
		ParsedLongTerms aggregations = response.getAggregations().get("group_by_l");
		List<? extends Bucket> buckets = aggregations.getBuckets();
		
		for (Bucket b : buckets) {
			Map<Integer, Long> categories = regions.getOrDefault(cities.get(((Long)b.getKey()).intValue()).getRegionId(), new HashMap<>());
			List<? extends Bucket> subBuckets = ((ParsedLongTerms)b.getAggregations().get("group_by_g")).getBuckets();
			for (Bucket sb : subBuckets) {
				categories.put(((Long)sb.getKey()).intValue(), categories.getOrDefault(sb.getKey(), 0l) + sb.getDocCount());
			}
			regions.put(cities.get(((Long)b.getKey()).intValue()).getRegionId(), categories);
		}
		
		for (Map.Entry<Integer, Map<Integer, Long>> entry : regions.entrySet()) {
			List<CategoryAdCount> categories = new ArrayList<>();
			for (Map.Entry<Integer, Long> subEntry : entry.getValue().entrySet()) {
				categories.add(new CategoryAdCount(subEntry.getKey(), subEntry.getValue()));
			}
			categories.sort(new Comparator<CategoryAdCount>() {

				@Override
				public int compare(CategoryAdCount o1, CategoryAdCount o2) {
					if (o1.getAdCount() < o2.getAdCount()) return 1;
					if (o1.getAdCount() > o2.getAdCount()) return -1;
					return 0;
				}
				
			});
			result.add(new TopCategoryResponseModel(entry.getKey(), categories));
		}
		
		return result;
	}
	
	
	public List<MonthlyStatisticsResponseModel> getRegionMonthlyStatistics(int regionId, int categoryId, String searchTerm,
			int priceLow, int priceHigh, Boolean dedup) throws IOException {
		List<MonthlyStatisticsResponseModel> result = new ArrayList<>();
		
		Map<Integer, City> cities = helperService.getCities();
		Map<String, MonthlyStatisticsResponseModel> months = new LinkedHashMap<>();
		
		for (Map.Entry<Integer, City> entry : cities.entrySet()) {
			if (entry.getValue().getRegionId() == regionId) {
				SearchResponse response = locationService.getMonthlyStatistics(entry.getValue().getId(), categoryId, searchTerm, priceLow, priceHigh, dedup);
				ParsedDateRange aggregation = response.getAggregations().get("months");
				List<? extends Range.Bucket> buckets = aggregation.getBuckets();
				
				for (Range.Bucket b : buckets) {
					MonthlyStatisticsResponseModel tr = months.getOrDefault(b.getKey(), new MonthlyStatisticsResponseModel(b.getKeyAsString(), 0, 0));
					tr.setAdCount(tr.getAdCount() + b.getDocCount());
					if (b.getDocCount() > 0)
						tr.setAveragePriceRSD(tr.getAveragePriceRSD() + ((ParsedAvg)b.getAggregations().get("average")).getValue()*b.getDocCount());
					months.put(b.getKeyAsString(), tr);
				}
			}
		}
		
		for (Map.Entry<String, MonthlyStatisticsResponseModel> entry : months.entrySet()) {
			result.add(new MonthlyStatisticsResponseModel(entry.getValue().getDateRange(),
					entry.getValue().getAdCount() > 0 ? entry.getValue().getAveragePriceRSD()/entry.getValue().getAdCount() : 0,
					entry.getValue().getAdCount()));
		}
		
		return result;
	}
	
	public List<LocationResponseModel> getStaticRegionData() throws IOException {
		Map<Integer, City> cities = helperService.getCities();
		Map<Integer, String> regions = helperService.getRegions();
		Map<Integer, LocationResponseModel> locations = new HashMap<>();
		
		for (Map.Entry<Integer, City> city : cities.entrySet()) {
			City c = city.getValue();
			LocationResponseModel loc = locations.getOrDefault(c.getRegionId(), new LocationResponseModel(c.getRegionId(),
					c.getRegionId(), 0, 0, regions.get(c.getRegionId())));
			
			loc.setPopulation(loc.getPopulation() + c.getPopulation());
			loc.setNumberOfSellers(loc.getNumberOfSellers() + ((Long)locationService.getDistinctUsersByCity(c.getId())).intValue());
			
			locations.put(c.getRegionId(), loc);
		}
		
		List<LocationResponseModel> response = new ArrayList<>();
		for (Map.Entry<Integer, LocationResponseModel> e : locations.entrySet()) {
			response.add(e.getValue());
		}
		return response;
	}
}
