package com.niriic.kp.services;

import java.util.Calendar;

import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.range.DateRangeAggregationBuilder;

public class AggregationQueryBuilder extends BaseBuilder {

	AggregationBuilder aggregationBuilder;
	
	public AggregationBuilder getAggregationBuilder() {
		return aggregationBuilder;
	}
	
	public AggregationQueryBuilder addAggregationGroupByLocation() {
		aggregationBuilder = AggregationBuilders.terms("group_by_l").field("location").size(200);
		return this;
	}
	
	public AggregationQueryBuilder addAggregationSumPriceRSD() {
		aggregationBuilder = AggregationBuilders.sum("sum").field("price_rsd");
		return this;
	}
	
	public AggregationQueryBuilder addAggregationMaxPriceRSD() {
		aggregationBuilder = AggregationBuilders.max("max").field("price_rsd");
		return this;
	}
	
	public AggregationQueryBuilder addAggregationMinPriceRSD() {
		aggregationBuilder = AggregationBuilders.min("min").field("price_rsd");
		return this;
	}
	
	public AggregationQueryBuilder addAggregationByDateRange() {
		// TODO: Should probably use DateHistogram
		DateRangeAggregationBuilder monthsAggregation = AggregationBuilders.dateRange("months").field("start_date");
		Calendar cal = Calendar.getInstance();
		cal.set(2016, 5, 1);
		while (cal.get(Calendar.YEAR) < 2018 || cal.get(Calendar.MONTH) < 6) {
			Calendar startDate = (Calendar)cal.clone(), endDate = (Calendar)cal.clone();
			startDate.set(Calendar.DATE, startDate.getActualMinimum(Calendar.DATE));
			endDate.set(Calendar.DATE, endDate.getActualMaximum(Calendar.DATE));
			monthsAggregation.addRange(convertDate(startDate.getTime()) + " 00:00:00",
					convertDate(endDate.getTime()) + " 23:59:59");
			cal.add(Calendar.MONTH, 1);
		}
		aggregationBuilder = monthsAggregation;
		return this;
	}
	
	public AggregationQueryBuilder addAggregationCountPerPriceHistogram(long interval, long offset) {
		aggregationBuilder = AggregationBuilders.histogram("countPerPrice").field("price_rsd")
				.interval(interval).offset(offset);
		return this;
	}
	
	public AggregationQueryBuilder addAggregationCountDistinctUsers() {
		aggregationBuilder = AggregationBuilders.cardinality("distinct_u").field("user");
		return this;
	}
	
	public AggregationQueryBuilder addSubAggregationSumPriceRSD() {
		aggregationBuilder.subAggregation(AggregationBuilders.sum("sum").field("price_rsd"));
		return this;
	}
	
	public AggregationQueryBuilder addSubAggregationAveragePriceRSD() {
		aggregationBuilder.subAggregation(AggregationBuilders.avg("average").field("price_rsd"));
		return this;
	}
	
	public AggregationQueryBuilder addSubAggregationGroupByCategory() {
		aggregationBuilder.subAggregation(AggregationBuilders.terms("group_by_g").field("category").size(1500));
		return this;
	}
	
	public AggregationQueryBuilder addSubAggregationCountDistinctUsers() {
		aggregationBuilder.subAggregation(AggregationBuilders.cardinality("distinct_u").field("user"));
		return this;
	}
}
