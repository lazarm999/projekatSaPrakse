package com.niriic.kp.services;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.metrics.cardinality.ParsedCardinality;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.niriic.kp.models.Category;

@Service
public class LocationService {

	@Autowired
	RestHighLevelClient restClient;
	
	@Autowired
	HelperService helperService;
	
	public SearchResponse getAds(Date startDate, Date endDate, String searchTerm, int categoryId, int priceLow, int priceHigh, Boolean dedup) throws IOException {
		
		QueryBuilder qb = new QueryBuilder();
		qb.addDateQuery(startDate, endDate);
		qb.addSearchTermQuery(searchTerm);
		qb.addPriceQuery(priceLow, priceHigh);
		qb.addCategoryQuery(helperService.getCategories(), categoryId);
		
		AggregationBuilder aggregation = new AggregationQueryBuilder().addAggregationGroupByLocation()
				.addSubAggregationSumPriceRSD().addSubAggregationAveragePriceRSD().addSubAggregationCountDistinctUsers()
				.getAggregationBuilder();
		qb.addAggregation(aggregation);
		
		SearchResponse response = restClient.search(qb.getSearchRequest(dedup));
		return response;
	}
	
	public SearchResponse getSellersByTown(Date startDate, Date endDate, String searchTerm, int categoryId, int priceLow, int priceHigh, Boolean dedup) throws IOException {
		
		QueryBuilder qb = new QueryBuilder();
		qb.addDateQuery(startDate, endDate);
		qb.addSearchTermQuery(searchTerm);
		qb.addPriceQuery(priceLow, priceHigh);
		qb.addCategoryQuery(helperService.getCategories(), categoryId);
		
		AggregationBuilder aggregation = new AggregationQueryBuilder().addAggregationGroupByLocation().
				addSubAggregationCountDistinctUsers().getAggregationBuilder();
		qb.addAggregation(aggregation);
		
		SearchResponse response = restClient.search(qb.getSearchRequest(dedup));
		return response;
	}
	
	public SearchResponse getTopCategories(Date startDate, Date endDate, Boolean dedup) throws IOException {
		
		QueryBuilder qb = new QueryBuilder();
		qb.addDateQuery(startDate, endDate);
		
		AggregationBuilder aggregation = new AggregationQueryBuilder().addAggregationGroupByLocation()
				.addSubAggregationGroupByCategory().getAggregationBuilder();
		qb.addAggregation(aggregation);
		
		SearchResponse response = restClient.search(qb.getSearchRequest(dedup));
		return response;
	}
	
	public SearchResponse getMonthlyStatistics(int cityId, int categoryId, String searchTerm, int priceLow, int priceHigh, Boolean dedup) throws IOException {
		Map<Integer, Category> categories = helperService.getCategories();
		
		QueryBuilder qb = new QueryBuilder();
		qb.addLocationQuery(cityId);
		qb.addSearchTermQuery(searchTerm);
		qb.addPriceQuery(priceLow, priceHigh);
		qb.addCategoryQuery(categories, categoryId);
		
		AggregationBuilder aggregation = new AggregationQueryBuilder().addAggregationByDateRange()
				.addSubAggregationAveragePriceRSD().getAggregationBuilder();
		qb.addAggregation(aggregation);
		
		SearchResponse response = restClient.search(qb.getSearchRequest(dedup));
		return response;
	}
	
	public long getDistinctUsersByCity(int cityId) throws IOException {
		
		QueryBuilder qb = new QueryBuilder();
		qb.addLocationQuery(cityId);
		
		AggregationBuilder aggregation = new AggregationQueryBuilder().addAggregationCountDistinctUsers().getAggregationBuilder();
		qb.addAggregation(aggregation);
		
		SearchResponse response = restClient.search(qb.getSearchRequest(true));
		return ((ParsedCardinality)response.getAggregations().get("distinct_u")).getValue();
	}
}
