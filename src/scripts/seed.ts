/**
 * Seed Script
 * 
 * Creates sample data for development and testing.
 * Run with: npx tsx src/scripts/seed.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  console.log('🌱 Starting seed...')

  const payload = await getPayload({ config })

  try {
    // ============================================
    // 1. Create Authors
    // ============================================
    console.log('📝 Creating Authors...')

    const authors = await Promise.all([
      payload.create({
        collection: 'authors',
        data: {
          name: 'Soni Gupta',
          role: 'Founder & Creative Director',
          status: 'active',
        },
      }),
      payload.create({
        collection: 'authors',

        data: {
          name: 'Alex Chen',
          role: 'Lead Engineer',
          status: 'active',
        },
      }),
    ])

    console.log(`   ✅ Created ${authors.length} authors`)

    // ============================================
    // 2. Create Categories
    // ============================================
    console.log('📂 Creating Categories...')

    const categories = await Promise.all([
      payload.create({
        collection: 'categories',
        data: {
          title: 'Technology',
          slug: 'technology',
          description: 'Deep dives into emerging tech and engineering',
          accentColor: '#6366F1',
        },
      }),
      payload.create({
        collection: 'categories',
        data: {
          title: 'Design',
          slug: 'design',
          description: 'UI/UX, product design, and visual aesthetics',
          accentColor: '#EC4899',
        },
      }),
      payload.create({
        collection: 'categories',
        data: {
          title: 'Culture',
          slug: 'culture',
          description: 'Trends, observations, and cultural commentary',
          accentColor: '#F59E0B',
        },
      }),
    ])

    console.log(`   ✅ Created ${categories.length} categories`)

    // ============================================
    // 3. Create Media
    // ============================================
    console.log('🖼️ Creating Media...')

    const media = await payload.create({
      collection: 'media',
      data: {
        altText: 'Seed Image',
      },
      file: {
        data: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64'),
        name: 'seed-image.png',
        mimetype: 'image/png',
        size: 68,
      },
    })

    console.log(`   ✅ Created media: ${media.id}`)
    const heroImageId = media.id

    // ============================================
    // 4. Create Tags
    // ============================================
    console.log('🏷️ Creating Tags...')

    const tags = await Promise.all([
      payload.create({ collection: 'tags', data: { title: 'AI', slug: 'ai' } }),
      payload.create({ collection: 'tags', data: { title: 'Web3', slug: 'web3' } }),
      payload.create({ collection: 'tags', data: { title: 'Minimalism', slug: 'minimalism' } }),
      payload.create({ collection: 'tags', data: { title: 'Cloudflare', slug: 'cloudflare' } }),
      payload.create({ collection: 'tags', data: { title: 'Next.js', slug: 'nextjs' } }),
    ])

    console.log(`   ✅ Created ${tags.length} tags`)

    // ============================================
    // 4. Create Admin User (if not exists)
    // ============================================
    console.log('👤 Checking Admin User...')

    const existingUsers = await payload.find({
      collection: 'users',
      where: { email: { equals: 'admin@soninewmedia.com' } },
      limit: 1,
    })

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'admin@soninewmedia.com',
          password: 'Admin123!@#',
          name: 'Admin',
          roles: ['admin'],
        },
      })
      console.log('   ✅ Created admin user (admin@soninewmedia.com)')
    } else {
    console.log('   ⏭️ Admin user already exists')
    }

    // ============================================
    // 5. Create Sample Transmissions
    // ============================================
    console.log('📡 Creating Transmissions...')

    const transmissions = await Promise.all([
      payload.create({
        collection: 'transmissions',
        draft: false,
        data: {
          title: 'Welcome to Soni New Media',
          slug: 'welcome',
          excerpt: 'A first look at the new digital frontier.',
          status: 'published',
          publishedAt: new Date().toISOString(),
          author: authors[0].id,
          category: categories[0].id,
          tags: [tags[0].id, tags[1].id],
          heroImage: heroImageId,
          layout: [
            {
              blockType: 'statement',
              text: 'The future of search is not keywords. It\'s meaning.',
              size: 'h2',
              alignment: 'center',
            },
            /*
            {
              blockType: 'richText',
              content: {
                root: {
                  type: 'root',
                  format: '',
                  indent: 0,
                  version: 1,
                  direction: 'ltr',
                  children: [
                    {
                      type: 'paragraph',
                      format: '',
                      indent: 0,
                      version: 1,
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Cloudflare Workers AI allows us to run machine learning models directly at the edge, reducing latency and protecting user privacy. By generating vector embeddings for every transmission, we unlock a semantic search experience that understands intent, not just string matching.',
                          version: 1,
                        },
                      ],
                    },
                  ],
                },
              },
            },
            */
            {
              blockType: 'codeTerminal',
              code: `// Generate embedding using Workers AI\nconst embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {\n  text: [doc.title + ' ' + doc.excerpt]\n})`,
              language: 'typescript',
              filename: 'generateEmbedding.ts',
            },
          ],
        },
      }),
      payload.create({
        collection: 'transmissions',
        draft: false,
        data: {
          title: 'Design Systems',
          slug: 'design-systems',
          excerpt: 'Building consistent and scalable UIs.',
          status: 'published',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          author: authors[0].id,
          category: categories[1].id,
          tags: [tags[3].id],
          heroImage: heroImageId,
          layout: [
            {
              blockType: 'statement',
              text: 'Design is not just what it looks like. Design is how it works.',
              size: 'h2',
              alignment: 'center',
              attribution: 'Steve Jobs',
            },
            /*
            {
              blockType: 'galleryWall',
              layoutType: 'grid',
              columns: '3',
              images: [heroImageId],
            },
            */
          ],
        },
      }),
      /*
      payload.create({
        collection: 'transmissions',
        draft: false,
        data: {
          title: 'Hidden Draft',
          slug: 'hidden-draft',
          excerpt: 'This should not be visible.',
          author: authors[0].id,
          category: categories[2].id,
          tags: [tags[4].id],
          status: 'draft',
          heroImage: heroImageId,
          layout: [
            {
              blockType: 'statement',
              text: 'React Server Components changed everything.',
              size: 'h3',
            },
          ],
        },
      }),
      */
      payload.create({
        collection: 'transmissions',
        draft: false,
        data: {
          title: 'Building at the Speed of Thought',
          slug: 'building-speed-of-thought',
          excerpt: 'How Payload 3.0 and Next.js 15 enable rapid iteration without sacrificing quality.',
          status: 'published',
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          author: authors[0].id,
          category: categories[0].id,
          tags: [tags[4].id, tags[3].id],
          heroImage: heroImageId,
          layout: [
            {
              blockType: 'statement',
              text: 'React Server Components changed everything.',
              size: 'h1',
              alignment: 'center',
            },
            {
              blockType: 'codeTerminal',
              code: `import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({ config: configPromise })
const posts = await payload.find({ collection: 'transmissions' })`,
              language: 'typescript',
              showLineNumbers: true,
              filename: 'page.tsx',
            },
          ],
        },
      }),
      payload.create({
        collection: 'transmissions',
        draft: false,
        data: {
          title: 'The Future of AI',
          slug: 'future-of-ai',
          excerpt: 'Exploring the intersection of code and cognition.',
          status: 'published',
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
          author: authors[1].id,
          category: categories[0].id,
          tags: [tags[2].id],
          heroImage: heroImageId,
          layout: [
            {
              blockType: 'statement',
              text: 'The platform is the framework.',
              size: 'h1',
              alignment: 'center',
            },
          ],
        },
      }),
      payload.create({
        collection: 'transmissions',
        draft: true, // Required for drafts
        data: {
          title: 'Glassmorphism: A Design Study',
          slug: 'glassmorphism-design-study',
          excerpt: 'Exploring the aesthetic of transparency, blur, and light in modern interfaces.',
          status: 'draft',
          author: authors[1].id,
          category: categories[1].id,
          tags: [tags[2].id],
          layout: [
            {
              blockType: 'statement',
              text: 'Depth through transparency.',
              size: 'h2',
              alignment: 'center',
            },
          ],
        },
      }),
    ])

    console.log(`   ✅ Created ${transmissions.length} transmissions (4 published, 1 draft)`)

    // ============================================
    // Complete
    // ============================================
    console.log('')
    console.log('🎉 Seed complete!')
    console.log('')
    console.log('📊 Summary:')
    console.log(`   • Authors: ${authors.length}`)
    console.log(`   • Categories: ${categories.length}`)
    console.log(`   • Tags: ${tags.length}`)
    console.log(`   • Transmissions: ${transmissions.length}`)
    console.log('')
    console.log('🔐 Admin Login:')
    console.log('   • Email: admin@soninewmedia.com')
    console.log('   • Password: Admin123!@#')
    console.log('   ⚠️ Change this password immediately!')

  } catch (err) {
    console.error(JSON.stringify(err, null, 2))
    process.exit(1)
  }

  process.exit(0)
}

seed()
