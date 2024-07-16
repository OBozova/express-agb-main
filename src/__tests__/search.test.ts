// searchAgbCodes.test.ts

import { Op, Sequelize } from 'sequelize';
import { searchAgbCodes } from '../services/agbCode.service';

// Mock Sequelize and AgbCode model
jest.mock('sequelize', () => {
  const actualSequelize = jest.requireActual('sequelize');
  const { DataTypes } = actualSequelize;

  return {
    ...actualSequelize,
    Op: actualSequelize.Op,
    literal: (value: string) => ({ value }),
    define: jest.fn(),
    findAll: jest.fn(),
  };
});

// Mock AgbCode model
jest.mock('../models/agbCodes.model', () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
  },
}));

describe('searchAgbCodes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should search AgbCodes with correct SQL query', async () => {
    const searchQuery = 'Doe';

    // Mock the expected behavior of AgbCode.findAll
    (require('../models/agbCodes.model').default.findAll as jest.Mock).mockResolvedValue([
      {
        agbCode: 'ABC123',
        name: 'John Doe',
        phoneNumber: '123456789',
        email: 'johndoe@example.com',
        street: '123 Main St',
        houseNumber: '1',
        houseNumberAddition: '',
        postalCode: '12345',
        city: 'Example City',
      },
    ]);

    const expectedQuery = {
      where: {
        [Op.or]: [
          Sequelize.literal(`"agbCode" ILIKE '%${searchQuery}%'`),
          Sequelize.literal(`"name" ILIKE '%${searchQuery}%'`),
          Sequelize.literal(`"phoneNumber" ILIKE '%${searchQuery}%'`),
          Sequelize.literal(`"email" ILIKE '%${searchQuery}%'`),
          Sequelize.literal(`"street" ILIKE '%${searchQuery}%'`),
          Sequelize.literal(`"houseNumber" ILIKE '%${searchQuery}%'`),
          Sequelize.literal(`"houseNumberAddition" ILIKE '%${searchQuery}%'`),
          Sequelize.literal(`"postalCode" ILIKE '%${searchQuery}%'`),
          Sequelize.literal(`"city" ILIKE '%${searchQuery}%'`),
        ],
      },
    };

    // Call the function
    const result = await searchAgbCodes(searchQuery);

    // Assert that Sequelize.findAll was called with the expected query
    expect(require('../models/agbCodes.model').default.findAll).toHaveBeenCalledWith(expectedQuery);

    // Assert the result
    expect(result).toHaveLength(1); // Assuming one result for the mocked data
    expect(result[0].agbCode).toBe('ABC123'); // Check specific result content
  });

  it('should handle errors gracefully', async () => {
    const searchQuery = 'Nonexistent';

    // Mock the AgbCode.findAll to throw an error
    (require('../models/agbCodes.model').default.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

    // Call the function and expect it to throw an error
    await expect(searchAgbCodes(searchQuery)).rejects.toThrowError('Database error');
  });
});
