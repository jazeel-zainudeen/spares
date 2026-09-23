import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
})

export const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  logo_url: z.string().url().optional().or(z.literal('')),
})

export const modelSchema = z.object({
  company_id: z.string().uuid("Invalid company ID"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  year_start: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  year_end: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional().nullable(),
})

export const partSchema = z.object({
  category_id: z.string().uuid("Invalid category ID").optional().nullable(),
  model_id: z.string().uuid("Invalid model ID"),
  item: z.string().min(1, "Item name is required"),
  ref_number: z.string().min(1, "Reference number is required"),
  oem_number: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
})
