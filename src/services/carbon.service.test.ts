import { describe, it, expect } from 'vitest';
import { 
  calculateTransportEmission, 
  calculateElectricityEmission, 
  calculateFoodEmission, 
  calculateTotalEmission 
} from './carbon.service';

describe('Carbon Calculation Service', () => {
  
  describe('calculateTransportEmission', () => {
    it('calculates correct values for valid mode and distance', () => {
      // Petrol car emission: 50km * 0.17 = 8.5
      expect(calculateTransportEmission(50, 'car_petrol')).toBe(8.5);
      
      // EV car emission: 100km * 0.05 = 5.0
      expect(calculateTransportEmission(100, 'car_ev')).toBe(5);
    });

    it('returns 0 for negative distance or NaN values', () => {
      expect(calculateTransportEmission(-50, 'car_petrol')).toBe(0);
      expect(calculateTransportEmission(NaN, 'car_petrol')).toBe(0);
    });

    it('returns 0 for unknown modes of transit', () => {
      expect(calculateTransportEmission(100, 'space_shuttle')).toBe(0);
    });
  });

  describe('calculateElectricityEmission', () => {
    it('calculates correct value for electricity kwh consumption', () => {
      // 100 kWh * 0.38 = 38.0
      expect(calculateElectricityEmission(100)).toBe(38);
    });

    it('returns 0 for negative consumption or NaN values', () => {
      expect(calculateElectricityEmission(-100)).toBe(0);
      expect(calculateElectricityEmission(NaN)).toBe(0);
    });
  });

  describe('calculateFoodEmission', () => {
    it('calculates correct value for food consumption', () => {
      // 10 meals * 0.5 (vegan) = 5.0
      expect(calculateFoodEmission(10, 'vegan')).toBe(5);
      
      // 5 meals * 3.0 (high_meat) = 15.0
      expect(calculateFoodEmission(5, 'high_meat')).toBe(15);
    });

    it('returns 0 for invalid inputs', () => {
      expect(calculateFoodEmission(-5, 'vegan')).toBe(0);
      expect(calculateFoodEmission(5, 'unsupported_diet')).toBe(0);
    });
  });

  describe('calculateTotalEmission', () => {
    it('aggregates emissions totals safely', () => {
      const metrics = {
        transport: 12.5,
        electricity: 30,
        food: 15.5,
        waste: 8
      };
      // Sum = 66
      expect(calculateTotalEmission(metrics)).toBe(66);
    });

    it('handles missing categories or negative values safely', () => {
      const metrics = {
        transport: 12.5,
        electricity: -30, // should be ignored
        food: undefined, // should be ignored
        waste: 10
      };
      // Sum = 22.5
      expect(calculateTotalEmission(metrics)).toBe(22.5);
    });
  });

});
