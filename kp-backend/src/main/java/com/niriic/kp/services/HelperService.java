package com.niriic.kp.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.histogram.Histogram.Bucket;
import org.elasticsearch.search.aggregations.bucket.histogram.ParsedHistogram;
import org.elasticsearch.search.aggregations.metrics.max.ParsedMax;
import org.elasticsearch.search.aggregations.metrics.min.ParsedMin;
import org.elasticsearch.search.aggregations.metrics.sum.ParsedSum;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.niriic.kp.models.Category;
import com.niriic.kp.models.City;
import com.niriic.kp.models.PriceInterval;
import com.niriic.kp.models.response.CategoryResponseModel;
import com.niriic.kp.models.response.CountPerPriceResponseModel;
import com.niriic.kp.models.response.TotalResponseModel;

@Service
public class HelperService {

	@Autowired
	RestHighLevelClient restClient;
	
	@Autowired
    JavaMailSender emailSender;
 
	
	Map<Integer, Category> categories;
	Map<Integer, City> cities;
	Map<Integer, String> regions, municipalities;
	
	@PostConstruct
	private void init() {
		initCities();
		initRegions();
		initMunicipalities();
		initCategories();
	}
	
	private void initCities() {
		cities = new HashMap<Integer, City>();
		JSONObject obj = loadJson("gradovi.json");
		JSONArray jsonCities = obj.getJSONArray("cities");
		for (int i = 0; i < jsonCities.length(); i++) {
			JSONObject o = jsonCities.getJSONObject(i);
			cities.put(o.getInt("id"), new City(
					o.getInt("id"),
					o.getDouble("lat"),
					o.getDouble("lng"),
					o.getString("name"),
					o.getInt("population"),
					o.getInt("region_id"),
					o.getInt("municipality_id")
				));
		}
	}
	
	private void initRegions() {
		regions = new HashMap<Integer, String>();
		JSONObject obj = loadJson("regions.json");
		JSONArray jsonCities = obj.getJSONArray("regions");
		for (int i = 0; i < jsonCities.length(); i++) {
			JSONObject o = jsonCities.getJSONObject(i);
			regions.put(o.getInt("regionId"), o.getString("name"));
		}
	}
	
	private void initMunicipalities() {
		municipalities = new HashMap<Integer, String>();
		JSONObject obj = loadJson("municipalities.json");
		JSONArray jsonCities = obj.getJSONArray("municipalities");
		for (int i = 0; i < jsonCities.length(); i++) {
			JSONObject o = jsonCities.getJSONObject(i);
			municipalities.put(o.getInt("municipalityId"), o.getString("name"));
		}
	}
	
	private JSONObject loadJson(String fileName) {
		String json = "";
		File file = null;
		
		try {
			file = new ClassPathResource("static/"+fileName).getFile();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		
		try (BufferedReader br = new BufferedReader(new FileReader(file))) {
		    String line;
		    while ((line = br.readLine()) != null) {
		       json+=line;
		    }
		} catch (IOException e) {
			System.out.println(e);
		}
		
		return new JSONObject(json);
	}
	
	private void initCategories() {
		categories = new HashMap<Integer, Category>();
		int perPg = 50, pg = 0;
		long res;
		do {
			SearchSourceBuilder builder = new SearchSourceBuilder();
			builder.size(perPg);
			builder.from(perPg*pg++);
			builder.query(QueryBuilders.matchAllQuery());
			
			SearchRequest search = new SearchRequest("kategorije");
			search.source(builder);
			
			SearchResponse response = null;
			try {
				response = restClient.search(search);
			} catch (IOException e) {
				e.printStackTrace();
			}
			SearchHits hits = response.getHits();
			res = hits.getHits().length;
			
			for (SearchHit hit : hits) {
				Map<String, Object> source = hit.getSourceAsMap();
				categories.put(Integer.parseInt(source.get("category_id").toString()),
						new Category(Integer.parseInt(source.get("parent").toString()),
								source.get("name").toString()));
			}
		} while (res == perPg);
	}
	
    public void sendEmail(String name, String fromEmail, String messageText) {
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setTo("vuk.bibic@gmail.com");
        message.setFrom(String.format("%s <%s>", name, fromEmail));
        message.setSubject("KP Sales Map - Contact Form"); 
        message.setText(String.format("From: %s\nEmail: %s\n\n%s", name, fromEmail, messageText));
        emailSender.send(message);
    }
	
	public List<CategoryResponseModel> getCategoryList() throws IOException {
		Map<Integer, CategoryResponseModel> tmp = new HashMap<>();
		List<CategoryResponseModel> result = new ArrayList<>();
		
		for (Map.Entry<Integer, Category> entry : categories.entrySet()) {
			if (entry.getValue().getParent() == 0) 
				tmp.put(entry.getKey(), new CategoryResponseModel(entry.getKey(), entry.getValue().getName(), new ArrayList<>()));
		}

		for (Map.Entry<Integer, Category> entry : categories.entrySet()) {
			if (entry.getValue().getParent() != 0)
				tmp.get(entry.getValue().getParent()).getSubcategories().add(new CategoryResponseModel(entry.getKey(), entry.getValue().getName(), null));
		}
		
		for (Map.Entry<Integer, CategoryResponseModel> entry : tmp.entrySet()) {
			result.add(entry.getValue());
		}
		
		Comparator<CategoryResponseModel> cmp = new Comparator<CategoryResponseModel>() {

			@Override
			public int compare(CategoryResponseModel o1, CategoryResponseModel o2) {
				return o1.getName().compareTo(o2.getName());
			}
			
		};
		
		for (CategoryResponseModel c : result) {
			List<CategoryResponseModel> categories = c.getSubcategories();
			categories.sort(cmp);
			c.setSubcategories(categories);
		}
		result.sort(cmp);
		
		return result;
	}
	
	public TotalResponseModel getTotalInfo(Date startDate, Date endDate, String searchTerm, int categoryId, int priceLow, int priceHigh, Boolean dedup) throws IOException {
		
		QueryBuilder qb = new QueryBuilder();
		qb.addDateQuery(startDate, endDate);
		qb.addSearchTermQuery(searchTerm);
		qb.addPriceQuery(priceLow, priceHigh);
		qb.addCategoryQuery(categories, categoryId);
		
		AggregationBuilder sumPriceRSDAggregation = new AggregationQueryBuilder().addAggregationSumPriceRSD().getAggregationBuilder();
		qb.addAggregation(sumPriceRSDAggregation);
		
		SearchResponse response = restClient.search(qb.getSearchRequest(dedup));
		long days = TimeUnit.DAYS.convert(endDate.getTime()-startDate.getTime(), TimeUnit.MILLISECONDS)+1;
		return new TotalResponseModel(response.getHits().totalHits,
				Math.round(((ParsedSum)response.getAggregations().get("sum")).getValue()), days);
	}

	public CountPerPriceResponseModel getCountPerPrice(Date startDate, Date endDate, String searchTerm, int categoryId,
			int priceLow, int priceHigh, Boolean dedup) throws IOException {
		
		QueryBuilder qb = new QueryBuilder();
		qb.addDateQuery(startDate, endDate);
		qb.addSearchTermQuery(searchTerm);
		qb.addCategoryQuery(categories, categoryId);
		qb.addPriceQuery(priceLow, priceHigh);
		
		AggregationBuilder aggregationMax = new AggregationQueryBuilder().addAggregationMaxPriceRSD().getAggregationBuilder();
		AggregationBuilder aggregationMin = new AggregationQueryBuilder().addAggregationMinPriceRSD().getAggregationBuilder();
		qb.addAggregation(aggregationMax, aggregationMin);
		SearchResponse response = restClient.search(qb.getSearchRequest(dedup));
		
		long minPrice = Math.round(((ParsedMin)response.getAggregations().get("min")).getValue());
		long maxPrice = Math.round(((ParsedMax)response.getAggregations().get("max")).getValue());
		long interval = (long) Math.ceil((maxPrice-minPrice)/100.0), offset = minPrice;
		
		SearchResponse aggregatedResponse = getCountPerPriceBetween(startDate, endDate, searchTerm, categoryId, priceLow, priceHigh, interval, offset, dedup);
		List<? extends Bucket> buckets = ((ParsedHistogram)aggregatedResponse.getAggregations().get("countPerPrice")).getBuckets();
		List<PriceInterval> intervals = new ArrayList<>();
		
		for (Bucket b : buckets) {
			intervals.add(new PriceInterval((long)(double)b.getKey() + interval/2, b.getDocCount()));
		}
		
		return new CountPerPriceResponseModel(minPrice, maxPrice, intervals);
	}
	
	private SearchResponse getCountPerPriceBetween(Date startDate, Date endDate, String searchTerm, int categoryId,
			int priceLow, int priceHigh, long interval, long offset, Boolean dedup) throws IOException {
		QueryBuilder qb = new QueryBuilder();
		qb.addDateQuery(startDate, endDate);
		qb.addSearchTermQuery(searchTerm);
		qb.addCategoryQuery(categories, categoryId);
		qb.addPriceQuery(priceLow, priceHigh);
		
		AggregationBuilder aggregation = new AggregationQueryBuilder().addAggregationCountPerPriceHistogram(interval, offset)
				.getAggregationBuilder();
		qb.addAggregation(aggregation);
		return restClient.search(qb.getSearchRequest(dedup));
	}
	
	public Map<Integer, Category> getCategories() {
		return categories;
	}

	public Map<Integer, City> getCities() {
		return cities;
	}
	
	public Map<Integer, String> getRegions() {
		return regions;
	}
	
	public Map<Integer, String> getMunicipalities() {
		return municipalities;
	}
}
