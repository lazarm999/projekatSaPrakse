import React from "react"
import { Translate } from "react-localize-redux";
import ReactTable from "react-table";
import { FaDownload } from 'react-icons/fa';
import { Row, Col, Button } from "reactstrap";
import classes from './Table.css';
import colors from '../../css/colors.css'
import '../../css/react-table.global.css';

class Table extends React.Component {

    getCities(allCities, id) {
        var data = [];
        allCities.forEach(city => {
            if([1522, 1527, 828, 840, 842].includes(id)) {
                if (city.regionId === id) {
                    data.push(city);
                }
            } else {
                if (city.municipalityId === id) {
                    data.push(city);
                }
            }
        });
        return data;
    }

    getMunicipalities(allMunicipalities, id) {
        var data = [];
        allMunicipalities.forEach(municipality => {
            if (municipality.regionId === id) {
                data.push(municipality);
            }
        });
        return data;
    }

    exportCSV(data) {
        var csvString = "";
        var info = this.props.info;

        csvString += "Broj oglasa," + info.adCount + "\n";
        csvString += "Vrednost oglasa," + info.valueOfAds + "\n";
        csvString += "Vremenski opseg," + info.timePeriod + "\n";
        csvString += "Termin pretrage," + info.searchTerm + "\n";
        csvString += "Kategorija," + info.categoryName + "\n";
        csvString += "Podkategorija," + info.subcategoryName + "\n";
        csvString += "Početni datum," + info.startDate + "\n";
        csvString += "Krajnji datum," + info.endDate + "\n";
        csvString += "Početna cena," + info.priceLow + "\n";
        csvString += "Krajnja cena," + info.priceHigh + "\n";
        csvString += "Normalizovano po br. stanovnika," + info.normalizedByPopulation + "\n";
        csvString += "Normalizovano po br. prodavaca," + info.normalizedBySellers + "\n";
        csvString += "Duplicirani podaci," + info.dedup + "\n";

        csvString += "\n";
        csvString += "\n";
        
        csvString += "Naziv,";
        csvString += "Broj oglasa,";
        csvString += "Prosečna cena oglasa,";
        csvString += "Broj prodavaca,";
        csvString += "Vrednost oglasa,";
        csvString += "Broj stanovnika,";
        csvString += "Ukupan broj prodavaca,";
        csvString += "\n";

        data.forEach(data => {
            csvString += data.name + ",";
            csvString += data.adCount + ",";
            csvString += data.averagePriceRSD + ",";
            csvString += data.numberOfSellers + ",";
            csvString += data.priceSumRSD + ",";
            csvString += data.population + ",";
            csvString += data.totalNumberOfSellers + ",";
            csvString += "\n";
        });

        return csvString;
    }

    downloadCSVFile = (type) => {
        var csvString = "";
        var fileName = "";
        if(type === "region") {
            csvString = this.exportCSV(this.props.regionData);
            fileName = "regioni.csv";
        } else if(type === "municipality") {
            csvString = this.exportCSV(this.props.municipalityData);
            fileName = "opštine.csv";
        } else if(type === "city") {
            csvString = this.exportCSV(this.props.cityData);
            fileName = "gradovi.csv";
        }

        var element = document.createElement("a");
        var file = new Blob([csvString], {type: 'text/csv'});
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        element.click();
      }

    render() {
        return (
            <div className={classes.Wrapper}>

                <Row className={classes.Row}>
                    <Col md={{size: 4}}>
                        <Button className={colors.primaryColor} onClick={() => this.downloadCSVFile("region")}>
                            <FaDownload /><Translate id="table.exportRegions" />
                        </Button>
                    </Col>

                    <Col md={{size: 4}}>
                        <Button className={colors.primaryColor} onClick={() => this.downloadCSVFile("municipality")}>
                            <FaDownload /><Translate id="table.exportMunicipalities" />
                        </Button>
                    </Col>

                    <Col md={{size: 4}}>
                        <Button className={colors.primaryColor} onClick={() => this.downloadCSVFile("city")}>
                            <FaDownload /><Translate id="table.exportCities" />
                        </Button>
                    </Col>
                </Row>
                <br />

                <Translate>
                    {
                        ({ translate }) =>
                            <ReactTable
                                style={{ width: "90%", margin: "auto" }}
                                data={this.props.regionData}
                                columns={[
                                    {

                                        columns: [
                                            {
                                                Header: translate("table.region"),
                                                accessor: "name",
                                            },
                                            {
                                                Header: translate("table.adCount"),
                                                accessor: "adCount",
                                            },
                                            {
                                                Header: translate("table.averagePriceRSD"),
                                                accessor: "averagePriceRSD",
                                            },
                                            {
                                                Header: translate("table.numberOfSellers"),
                                                accessor: "numberOfSellers",
                                            },
                                            {
                                                Header: translate("table.priceSumRSD"),
                                                accessor: "priceSumRSD",
                                            },
                                            {
                                                Header: translate("table.population"),
                                                accessor: "population",
                                            },
                                            {
                                                Header: translate("table.totalNumberOfSellers"),
                                                accessor: "totalNumberOfSellers",
                                            },
                                        ]
                                    },
                                ]}
                                defaultPageSize={10}
                                defaultSorted={[
                                    {
                                        id: "name",
                                    }
                                ]}
                                className="-striped -highlight"
                                SubComponent={row => {
                                    let data = this.getMunicipalities(this.props.municipalityData, row.original.id);
                                    let length = data.length;
                                    return (
                                        <ReactTable
                                            data={data}
                                            style={{ paddingLeft: "50px" }}
                                            showPagination={false}
                                            defaultPageSize={length}
                                            columns={[
                                                {
                                                    columns: [
                                                        {
                                                            Header: translate("table.municipality"),
                                                            accessor: "name",
                                                        },
                                                        {
                                                            Header: translate("table.adCount"),
                                                            accessor: "adCount",
                                                        },
                                                        {
                                                            Header: translate("table.averagePriceRSD"),
                                                            accessor: "averagePriceRSD",
                                                        },
                                                        {
                                                            Header: translate("table.numberOfSellers"),
                                                            accessor: "numberOfSellers",
                                                        },
                                                        {
                                                            Header: translate("table.priceSumRSD"),
                                                            accessor: "priceSumRSD",
                                                        },
                                                        {
                                                            Header: translate("table.population"),
                                                            accessor: "population",
                                                        },
                                                        {
                                                            Header: translate("table.totalNumberOfSellers"),
                                                            accessor: "totalNumberOfSellers",
                                                        },
                                                    ]
                                                },
                                            ]}
                                            defaultSorted={[
                                                {
                                                    id: "name",
                                                }
                                            ]}
                                            SubComponent={row => {
                                                let data = this.getCities(this.props.cityData, row.original.id);
                                                let length = data.length;
                                                return (
                                                    <ReactTable
                                                        data={data}
                                                        style={{ marginLeft: "50px" }}
                                                        showPagination={false}
                                                        defaultPageSize={length}
                                                        columns={[
                                                            {
                                                                columns: [
                                                                    {
                                                                        Header: translate("table.city"),
                                                                        accessor: "name"
                                                                    },
                                                                    {
                                                                        Header: translate("table.adCount"),
                                                                        accessor: "adCount",
                                                                    },
                                                                    {
                                                                        Header: translate("table.averagePriceRSD"),
                                                                        accessor: "averagePriceRSD",

                                                                    },
                                                                    {
                                                                        Header: translate("table.numberOfSellers"),
                                                                        accessor: "numberOfSellers",
                                                                    },
                                                                    {
                                                                        Header: translate("table.priceSumRSD"),
                                                                        accessor: "priceSumRSD",
                                                                    },
                                                                    {
                                                                        Header: translate("table.population"),
                                                                        accessor: "population",
                                                                    },
                                                                ]
                                                            },
                                                        ]}
                                                        defaultSorted={[
                                                            {
                                                                id: "city.cityName",
                                                            }
                                                        ]}
                                                    />
                                                );
                                            }}
                                        />
                                    );
                                }
                                }
                            />
                    }
                </Translate>
            </div>
        );
    }
}

export default Table;