import React, { useState, useEffect } from "react";
import './css/App.css';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import { sortData } from "./_helpers";
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import LineGraph from './components/LineGraph';
import "leaflet/dist/leaflet.css";


function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('worldwide');
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([])
	const [casesType, setCasesType] = useState('cases');
	
	useEffect (() => {
		fetch ("https://disease.sh/v3/covid-19/all") 
		.then((response) => response.json())
		.then((data) => {
			setCountryInfo(data)
		});
	},[])

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch ("https://disease.sh/v3/covid-19/countries")
			.then((response) => response.json())
			.then((data) => {
				const countries = data.map((country) => (
					{
						name: country.country,
						value: country.countryInfo.iso2,
					}
				));
				
				const sortedData = sortData(data)
				setTableData(sortedData);
				setMapCountries(data);
				setCountries(countries);
				
			});
		}
		getCountriesData();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		setCountry(countryCode);
		
		const url = countryCode === 'worldwide' ? 
			'https://disease.sh/v3/covid-19/countries' : 
			`https://disease.sh/v3/covid-19/countries/${countryCode}`; 
		await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			setCountry(countryCode);
			setCountryInfo(data);

			countryCode === 'worldwide' ? setMapCenter([34.80746, -40.4796]) : setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
			countryCode === 'worldwide' ? setMapZoom(2): setMapZoom(4);
		})
		
	};

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>COVID Tracker</h1>
					<FormControl className="app__dropdown">
						<Select variant="outlined" value={country} onChange={onCountryChange}>
							<MenuItem value="worldwide">World Wide</MenuItem>
							{
								countries.map(country => (
									<MenuItem value={country.value}>{country.name}</MenuItem>
								))
							}
						</Select>
					</FormControl>
				</div>
		
				<div className="app__stats">
					<InfoBox 
						isRed
						country={country}
						active={casesType === 'cases'}
						onClick={e => setCasesType('cases')}
						title="Coronavirus Cases" 
						cases={countryInfo.todayCases} 
						total={countryInfo.cases} 
					/>

					<InfoBox
						country={country}
						active={casesType === 'recovered'}	
						onClick={e => setCasesType('recovered')}
						title="Recovered" 
						cases={countryInfo.todayRecovered} 
						total={countryInfo.recovered} 
					/>

					<InfoBox
						isRed
						country={country}
						active={casesType === 'deaths'}
						onClick={e => setCasesType('deaths')}
						title="Deaths" 
						cases={countryInfo.todayDeaths} 
						total={countryInfo.deaths} 
					/>
				</div>
				{/* World Map */}
				<Map casesType={casesType} countries={mapCountries} center={mapCenter}  zoom={mapZoom} />
			</div>
			<Card className="app__right">
				<CardContent>
					<h3>Live Cases - Country</h3>
						<Table countries={tableData} />
					<h3 style={{marginTop: '20px'}}>{casesType} - Worldwide</h3>
					<LineGraph casesType={casesType}/>
				</CardContent>

			</Card>
			
		</div>
  	);
}

export default App;
