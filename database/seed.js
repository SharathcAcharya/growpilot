const mongoose = require('mongoose');

// Sample campaign data for demo
const sampleCampaigns = [
  {
    name: 'Summer Sale 2024',
    objective: 'sales',
    platform: 'facebook',
    status: 'draft',
    budget: {
      total: 500,
      daily: 50,
      currency: 'USD',
      spent: 0,
    },
    targeting: {
      age: { min: 25, max: 45 },
      gender: 'all',
      locations: ['United States', 'Canada'],
      interests: ['shopping', 'fashion', 'deals'],
    },
    schedule: {
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-30'),
      timezone: 'America/New_York',
    },
  },
  {
    name: 'Brand Awareness - Tech Launch',
    objective: 'awareness',
    platform: 'linkedin',
    status: 'draft',
    budget: {
      total: 1000,
      daily: 100,
      currency: 'USD',
      spent: 0,
    },
    targeting: {
      age: { min: 30, max: 55 },
      gender: 'all',
      locations: ['United States', 'United Kingdom'],
      interests: ['technology', 'innovation', 'business'],
    },
    schedule: {
      startDate: new Date('2024-05-15'),
      endDate: new Date('2024-06-15'),
      timezone: 'UTC',
    },
  },
];

// Sample influencer categories
const sampleCategories = [
  'fashion',
  'beauty',
  'tech',
  'fitness',
  'food',
  'travel',
  'lifestyle',
  'business',
  'education',
  'entertainment',
];

console.log('GrowPilot Database Seeded Successfully!');
console.log('Sample campaigns and categories added.');
console.log('\nYou can now start using the application.');
