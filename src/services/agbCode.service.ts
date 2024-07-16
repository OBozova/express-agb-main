import { Op, Sequelize } from 'sequelize';
import AgbCode from '../models/agbCodes.model'; // Adjust path as per your project structure

export async function searchAgbCodes(searchQuery: string): Promise<AgbCode[]> {
  try {
    const searchResults = await AgbCode.findAll({
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
    });
    return searchResults;
  } catch (error) {
    console.error('Error searching AgbCodes:', error);
    throw error;
  }
}

export default {
  searchAgbCodes,
};
