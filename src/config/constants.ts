export const CARBON_FACTORS = {
  transport: {
    car_petrol: 0.17, // kg CO2e per km
    car_diesel: 0.16,
    car_ev: 0.05,
    public_transit: 0.04,
    bicycle: 0,
    walking: 0,
  },
  energy: {
    electricityKwh: 0.38, // kg CO2e per kWh
    heating: {
      gas: 180, // kg CO2e per month
      electric: 80,
      oil: 250,
      none: 0,
    },
  },
  food: {
    vegan: 0.5, // kg CO2e per meal
    vegetarian: 0.8,
    low_meat: 1.5,
    high_meat: 3.0,
  },
  waste: {
    monthlyBaseline: 120, // kg CO2e standard baseline waste per month
    recyclingOffsets: {
      recyclePaper: -10, // offsets (savings)
      recyclePlastic: -15,
      recycleGlass: -8,
    },
  },
};

export const MOCK_TIPS = [
  {
    id: '1',
    category: 'transport',
    text: 'Commute by public transport or carpool at least once a week to reduce transit emissions by 15%.',
    impactKg: 12,
  },
  {
    id: '2',
    category: 'energy',
    text: 'Lower your thermostat by 1°C. It can reduce your heating bills and home carbon emissions by up to 10%.',
    impactKg: 25,
  },
  {
    id: '3',
    category: 'food',
    text: 'Try swapping one beef meal a week for a plant-based alternative. Beef has a carbon footprint 6x higher than lentils.',
    impactKg: 8,
  },
  {
    id: '4',
    category: 'waste',
    text: 'Ensure all aluminum cans are rinsed and recycled. Recycling aluminum saves 95% of the energy needed to make new cans.',
    impactKg: 5,
  },
];
