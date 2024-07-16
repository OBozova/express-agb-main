import { z } from 'zod';

export const agbCodeSchema = z.object({
    agbCode: z.string().min(1),
    name: z.string().nullable().transform(value => (value === 'NULL' ? null : value)),
    phoneNumber: z.string(),
    email: z.string().nullable().transform(value => (value === 'NULL' ? null : value)),
    street: z.string().nullable().transform(value => (value === 'NULL' ? null : value)),
    houseNumber: z.string().nullable().transform(value => (value === 'NULL' ? null : value)),
    houseNumberAddition: z.string().nullable().transform(value => (value === 'NULL' ? null : value)),
    postalCode: z.string().nullable().transform(value => (value === 'NULL' ? null : value)),
    city: z.string().nullable().transform(value => (value === 'NULL' ? null : value)),
});
export type AgbCodeSchema = z.infer<typeof agbCodeSchema>
