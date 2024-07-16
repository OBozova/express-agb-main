import { parseCsv } from "../functions/parseCsv";

describe('parseCsv function', () => {
  it('should correctly parse CSV data', () => {
    const csvData = '"agbCode","name","phoneNumber","email","street","houseNumber","houseNumberAddition","postalCode","city"\n123,John Doe,1234567890,john.doe@example.com,NULL,NULL,NULL,NULL,NULL\n456,Jane Smith,9876543210,jane.smith@example.com,NULL,NULL,NULL,NULL,NULL\n,Invalid Row,Invalid Phone,invalid.email,NULL,NULL,NULL,NULL,NULL';

    const result = parseCsv(csvData);

    // Check if faultyRows contains the expected faulty row
    expect(result.faultyRows).toHaveLength(1);

    // Check if upsertRows contains the expected valid rows
    expect(result.upsertRows).toHaveLength(2);
    expect(result.upsertRows[0].agbCode).toBe('123');
    expect(result.upsertRows[1].agbCode).toBe('456');
  });

  it('should handle empty CSV data', () => {
    const csvData = '';

    const result = parseCsv(csvData);

    // Expect both arrays to be empty
    expect(result.faultyRows).toHaveLength(0);
    expect(result.upsertRows).toHaveLength(0);
  });
});
