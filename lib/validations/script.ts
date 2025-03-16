import { z } from "zod"

export const scriptSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อสคริปต์"),
  description: z.string().min(1, "กรุณากรอกคำอธิบายสคริปต์"),
  fullDescription: z.string().optional(),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  resourceName: z.string().min(1, "กรุณากรอกชื่อ Resource"),
  price: z.number().min(0, "ราคาต้องไม่ต่ำกว่า 0"),
  pointsPrice: z.number().min(0, "ราคาพอยท์ต้องไม่ต่ำกว่า 0"),
  imageUrl: z.string().optional(),
  features: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  installation: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).default("DRAFT"),
  versions: z.array(z.object({
    version: z.string(),
    downloadUrl: z.string(),
    releaseNotes: z.string().optional(),
    createdAt: z.date().optional().default(() => new Date())
  })).default([]),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().min(0).optional(),
  image: z.string().optional(),
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional().default(() => new Date())
})

export type Script = z.infer<typeof scriptSchema>

export const scriptFormSchema = scriptSchema.omit({
  createdAt: true,
  updatedAt: true
}) 