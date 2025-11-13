import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OsmService {
  private readonly BASE_URL: string;

  constructor(private configService: ConfigService) {
    this.BASE_URL =
      this.configService.get<string>('GEO_BASE_URL') || 'https://nominatim.openstreetmap.org';
  }

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
          'User-Agent': 'YourAppName/1.0',
        },
      });

      return response.data.length ? response.data[0] : null;
    } catch (err) {
      console.error('Error fetching coordinates:', err);
      throw new Error('Failed to get coordinates from Nominatim');
    }
  }

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
          'User-Agent': 'YourAppName/1.0',
        },
      });

      return response.data;
    } catch (err) {
      console.error('Error reverse geocoding:', err);
      throw new Error('Failed to reverse geocode coordinates');
    }
  }
}
