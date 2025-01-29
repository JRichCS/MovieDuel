import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
const APIKey = "49d1699ecbeb4879a883e25e123aed6c"

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [cityData, setCityData] = useState([]); // Store multiple cities as an array

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch MBTA vehicle data
        const result = await axios.get(
          'https://api-v3.mbta.com/vehicles?sort=updated_at&page[limit]=3'
        );

        const vehicles = result.data.data;
        setAlerts(vehicles);

        // Fetch city data for each vehicle location
        const cityDataArray = await Promise.all(
          vehicles.map(async (vehicle) => {
            const latitude = vehicle.attributes.latitude;
            const longitude = vehicle.attributes.longitude;

            if (!latitude || !longitude) {
              console.warn(`Missing coordinates for vehicle: ${vehicle.id}`);
              return null;
            }

            const geonamesUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${APIKey}`;
            try {
              const response = await axios.get(geonamesUrl);
              const cityInfo = response.data[0];
              return {
                vehicleId: vehicle.id,
                cityInfo,
              };
            } catch (error) {
              console.error('Error fetching city data:', error);
              return {
                vehicleId: vehicle.id,
                cityInfo: null,
              };
            }
          })
        );

        setCityData(cityDataArray.filter(Boolean));
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {alerts.map((vehicle) => {
        const cityInfo = cityData.find((data) => data.vehicleId === vehicle.id)?.cityInfo;
        return (
          <Card
            key={vehicle.id}
            body
            outline
            color="success"
            className="mx-1 my-2"
            style={{ width: '30rem' }}
          >
            <Card.Body>
              <Card.Title>Vehicle ID: {vehicle.id}</Card.Title>
              <Card.Text>
                Location: {vehicle.attributes.latitude}, {vehicle.attributes.longitude}
                <br />
                City: {cityInfo?.name || 'Unknown'}
              </Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}

export default Alerts;