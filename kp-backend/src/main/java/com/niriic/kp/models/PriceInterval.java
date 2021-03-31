package com.niriic.kp.models;

public class PriceInterval {
	long priceRSD, adCount;

	public PriceInterval(long priceRSD, long adCount) {
		super();
		this.priceRSD = priceRSD;
		this.adCount = adCount;
	}

	public long getPriceRSD() {
		return priceRSD;
	}

	public void setPriceRSD(long priceRSD) {
		this.priceRSD = priceRSD;
	}

	public long getAdCount() {
		return adCount;
	}

	public void setAdCount(long adCount) {
		this.adCount = adCount;
	}
	
	
	
}
