import React from 'react';

class CountPerPriceChartTooltip extends React.Component {

    render() {
        const { active } = this.props;
        if (active) {
            const { payload } = this.props;
            return (
                <div className="custom-tooltip">
                    <p>{"Broj oglasa: " + (payload === null ? "0" : payload[0].payload.adCount)}</p>
                    <p>{"Cena oglasa: " + (payload === null ? "0" : payload[0].payload.priceRSD)}</p>
                </div>
            );
        }
        return null;
    }
}

export default CountPerPriceChartTooltip;