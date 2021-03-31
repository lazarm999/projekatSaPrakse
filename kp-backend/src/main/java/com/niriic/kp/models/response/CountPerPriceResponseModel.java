package com.niriic.kp.models.response;

import java.util.List;

import com.niriic.kp.models.PriceInterval;

public class CountPerPriceResponseModel {
	long minPriceRSD, maxPriceRSD;
	List<PriceInterval> adCountByPriceInterval;
	
	public CountPerPriceResponseModel(long minPriceRSD, long maxPriceRSD, List<PriceInterval> adCountByPriceInterval) {
		super();
		this.minPriceRSD = minPriceRSD;
		this.maxPriceRSD = maxPriceRSD;
		this.adCountByPriceInterval = adCountByPriceInterval;
	}

	public long getMinPriceRSD() {
		return minPriceRSD;
	}

	public void setMinPriceRSD(long minPriceRSD) {
		this.minPriceRSD = minPriceRSD;
	}

	public long getMaxPriceRSD() {
		return maxPriceRSD;
	}

	public void setMaxPriceRSD(long maxPriceRSD) {
		this.maxPriceRSD = maxPriceRSD;
	}

	public List<PriceInterval> getAdCountByPriceInterval() {
		return adCountByPriceInterval;
	}

	public void setAdCountByPriceInterval(List<PriceInterval> adCountByPriceInterval) {
		this.adCountByPriceInterval = adCountByPriceInterval;
	}
	
	
}
