import type { Quiz, EducationArticle } from '../../../types';

export const MOCK_ARTICLES: EducationArticle[] = [
  {
    id: 'art-1',
    title: 'The Hidden Cost of Beef: Nutrition vs Emissions',
    slug: 'cost-of-beef',
    summary: 'Discover how dietary choices represent the single quickest individual pathway to footprint reduction.',
    readTimeMinutes: 4,
    category: 'Food',
    content: 'The livestock sector is a major stressor on many ecosystems and the planet. Beef production is especially carbon-intensive. Cattle emit methane (a greenhouse gas with 28x the warming potential of CO2) during digestion. Swapping beef for beans, chickpeas, or poultry can reduce individual food-related emissions by up to 50% overnight. It requires 20x less land and emits 20x fewer greenhouse gases to produce a gram of protein from beans compared to beef.'
  },
  {
    id: 'art-2',
    title: 'Electrifying Everything: The Home Heat Pump Revolution',
    slug: 'heat-pump-revolution',
    summary: 'Traditional gas and oil heating represents a massive chunk of carbon baselines. Here is why heat pumps are the future.',
    readTimeMinutes: 5,
    category: 'Energy',
    content: 'Heat pumps do not create heat; they transfer it from the outside air or ground into your home. This makes them up to 300% to 400% efficient compared to the best gas boilers which operate at around 90% efficiency. By combining heat pumps with solar panels or a green utility plan, residential heating footprints can fall close to absolute zero.'
  },
  {
    id: 'art-3',
    title: 'Mythbusting Recycling: What actually happens to Plastic?',
    slug: 'mythbusting-recycling',
    summary: 'Understanding the priorities of waste sorting. Why reducing consumption is 10x more powerful than recycling.',
    readTimeMinutes: 3,
    category: 'Waste',
    content: 'While recycling is beneficial, only about 9% of all plastic waste generated globally gets recycled. The rest ends up in landfills or polluting oceans. Aluminum, cardboard, and glass can be recycled almost indefinitely without losing quality. For plastic, however, the process degrades the polymers, limiting its reuse. The absolute priority should always be: Refuse, Reduce, Reuse, and only then Recycle.'
  }
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'q-1',
    title: 'Carbon Footprint Basics',
    description: 'Learn the primary definitions and scale of carbon calculations.',
    xpReward: 50,
    questions: [
      {
        id: 'q1-1',
        question: 'What is the average global carbon footprint per person per year?',
        options: ['~1 tonne CO2e', '~4 tonnes CO2e', '~10 tonnes CO2e', '~20 tonnes CO2e'],
        correctOptionIndex: 1,
        explanation: 'The average global footprint is around 4 tonnes CO2e, but to avoid the worst effects of climate change, the target global average needs to drop under 2 tonnes by 2050.'
      },
      {
        id: 'q1-2',
        question: 'Which of these greenhouse gases has the highest warming potency over 100 years?',
        options: ['Carbon Dioxide (CO2)', 'Water Vapor', 'Methane (CH4)', 'Nitrous Oxide (N2O)'],
        correctOptionIndex: 3,
        explanation: 'Nitrous Oxide (N2O) is nearly 300 times more potent than Carbon Dioxide, mainly originating from synthetic fertilizers and industrial processes.'
      },
      {
        id: 'q1-3',
        question: 'Which sector is globally responsible for the largest share of greenhouse gas emissions?',
        options: ['Transportation', 'Agriculture & Land Use', 'Electricity & Heat Production', 'Industrial Manufacturing'],
        correctOptionIndex: 2,
        explanation: 'Electricity and heat production accounts for roughly 25% of global emissions, followed closely by agriculture, forestry, and industry.'
      }
    ]
  },
  {
    id: 'q-2',
    title: 'Sustainable Nutrition',
    description: 'Test your understanding of emissions behind the food on your plate.',
    xpReward: 50,
    questions: [
      {
        id: 'q2-1',
        question: 'Compared to beans, how much higher are the carbon emissions of beef per gram of protein?',
        options: ['2 times higher', '5 times higher', '10 times higher', '20 times higher'],
        correctOptionIndex: 3,
        explanation: 'Beef emits 20 times more greenhouse gases per gram of protein than plant-based proteins like beans and lentils.'
      },
      {
        id: 'q2-2',
        question: 'Which type of diet results in the lowest annual carbon footprint?',
        options: ['Mediterranean', 'Vegetarian', 'Vegan', 'Paleo'],
        correctOptionIndex: 2,
        explanation: 'A fully plant-based (vegan) diet produces the lowest emissions, saving up to 1.5 tonnes of CO2e per person per year compared to a high-meat diet.'
      }
    ]
  }
];
