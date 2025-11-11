import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
    readTime: z.string(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    status: z.enum(['Active', 'In Development', 'Planning', 'Experimental', 'Completed', 'Archived']),
    github: z.string().optional(),
    demo: z.string().optional(),
    image: z.string().optional(),
    color: z.string().default('cyan'),
    featured: z.boolean().default(false),
    date: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = { blog, projects };
