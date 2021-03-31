package com.niriic.kp.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import com.niriic.kp.models.Category;

public class QueryBuilder extends BaseBuilder {

	private BoolQueryBuilder boolQueryBuilder;
	private SearchSourceBuilder searchSourceBuilder;
	
	public QueryBuilder() {
		this.boolQueryBuilder = QueryBuilders.boolQuery();
		this.searchSourceBuilder = new SearchSourceBuilder();
	}
	
	public void addDateQuery(Date startDate, Date endDate) {
		String sd = convertDate(startDate) + " 00:00:00", ed = convertDate(endDate) + " 23:59:59";
		
		boolQueryBuilder.should(QueryBuilders.rangeQuery("start_date").from(sd).to(ed));
		boolQueryBuilder.should(QueryBuilders.rangeQuery("end_date").from(sd).to(ed));
		boolQueryBuilder.should(QueryBuilders.boolQuery()
				.must(QueryBuilders.rangeQuery("start_date").to(sd))
				.must(QueryBuilders.rangeQuery("end_date").from(ed)));
	}
	
	public void addSearchTermQuery(String searchTerm) {
		if (searchTerm != null && searchTerm.trim() != "")
			boolQueryBuilder.must(QueryBuilders.multiMatchQuery(searchTerm, "title", "description").fuzziness(2));
	}
	
	public void addPriceQuery(int priceLow, int priceHigh) {
		if (priceHigh > 0) 
			boolQueryBuilder.must(QueryBuilders.rangeQuery("price_rsd").from(priceLow).to(priceHigh));
	}
	
	public void addCategoryQuery(Map<Integer, Category> categories, int categoryId) {
		if (categoryId != 0) {
			if (categories.get(categoryId).getParent() != 0) {
				boolQueryBuilder.must(QueryBuilders.matchQuery("category", categoryId));
			} else {
				List<Integer> subcategories = new ArrayList<>();
				for (Map.Entry<Integer, Category> entry : categories.entrySet()) {
					if (entry.getValue().getParent() == categoryId) subcategories.add(entry.getKey());
				subcategories.add(categoryId);
				}
				boolQueryBuilder.must(QueryBuilders.termsQuery("category", subcategories));
			}
		}
	}
	
	public void addLocationQuery(int cityId) {
		boolQueryBuilder.must(QueryBuilders.termQuery("location", cityId));
	}
	
	public void addAggregation(AggregationBuilder ... aggregationBuilder) {
		for (AggregationBuilder a : aggregationBuilder)
			searchSourceBuilder.aggregation(a);
	}
	
	public SearchRequest getSearchRequest(Boolean dedup) {
		boolQueryBuilder.mustNot(QueryBuilders.termQuery("location", 6));
		searchSourceBuilder.query(boolQueryBuilder);
		searchSourceBuilder.size(0);
		
		SearchRequest search = new SearchRequest(dedup ? "ads_deduped" : "ads_all");
		search.source(searchSourceBuilder);
		return search;
	}
}
