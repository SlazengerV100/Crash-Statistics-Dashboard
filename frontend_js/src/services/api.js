import axios from 'axios';

export const fetchYearsFromBackend = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/years');
    return response.data; // expected to be something like: [2018, 2019, 2020, 2021]
  } catch (error) {
    console.error('Error fetching years:', error);
    return [];
  }
};

export const fetchMapDataFromYear = async (year) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/crashes/location?year=${year}`);
      console.log('Map data fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching map data:', error);
      return null;
    }
  }

  export const fetchallMapDataFrom = async (year) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/crashes/location`);
      console.log('Map data fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching map data:', error);
      return null;
    }
  }