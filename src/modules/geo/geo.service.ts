import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeoService {
  private BASE_URL = 'https://nominatim.openstreetmap.org';

  // Address → Coordinates
  async addressToCoordinates(query: string) {
    try {
      const url = `${this.BASE_URL}/search`;
      
      const response = await axios.get(url, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 1,
        },
        headers: {
          'User-Agent': 'YourAppName/1.0'
        }
      });

      return response.data.length ? response.data[0] : null;

    } catch (err) {
      console.error('Error fetching coordinates:', err);
      throw new Error('Failed to get coordinates from Nominatim');
    }
  }

  // Coordinates → Address
  async coordinatesToAddress(lat: string, lon: string) {
    try {
      const url = `${this.BASE_URL}/reverse`;

      const response = await axios.get(url, {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'YourAppName/1.0'
        }
      });

      return response.data;

    } catch (err) {
      console.error('Error reverse geocoding:', err);
      throw new Error('Failed to reverse geocode coordinates');
    }
  }
}
