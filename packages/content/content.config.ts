import { defineContentConfig, defineCollection, z } from '@nuxt/content'


import { asSeoCollection } from '@nuxtjs/seo/content'

const pageSchema = z.object({
  layout: z.enum(['default', 'blog-layout']).default('default'),
  title: z.string(),
  description: z.string(),
  head: z.object({
    meta: z.array(z.object({
      name: z.string(),
      content: z.string()
    })),
    htmlAttrs: z.object({
      lang: z.string()
    }).optional(),
    bodyAttrs: z.object({
      class: z.string()
    }).optional(),
  })
})
const blogSchema = z.object({
  tags: z.array(z.string()).optional(),
  layout: z.enum(['default', 'blog-layout']).default('blog-layout'),
  title: z.string(),
  description: z.string(),
  image: z.object({
    src: z.string(),
    alt: z.string()
  }),
  date: z.string(),
  publishedAt: z.string(),
  head: z.object({
    meta: z.array(z.object({
      name: z.string(),
      content: z.string()
    })),
    htmlAttrs: z.object({
      lang: z.string()
    }).optional(),
    bodyAttrs: z.object({
      class: z.string()
    }).optional(),
  }),
  category: z.string(),
  featured: z.boolean().default(false),
  author: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
    social: z.string()
  }),
  ogImage: z.object({
    component: z.enum(['BlogOgImage', 'Video']).default('BlogOgImage'),
    props: z.object({
      title: z.string(),
      description: z.string(),
      image: z.string()
    })
  })
});

export const collections = {
  content_en: defineCollection(asSeoCollection({
    type: 'page',
    source: {
      include: 'en/**',
      prefix: '',
    },
    schema: pageSchema
  })),

  blog_en: defineCollection(asSeoCollection({
    type: 'page',
    source: {
      include: 'en/blogs/**',
      prefix: '',
    },
    schema: blogSchema
  }))
}
