/**
 * Seed Script
 * 
 * Creates sample data for development and testing.
 * Run with: npx tsx src/scripts/seed.ts
 */

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
    // 3. Create Tags
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
      // @ts-expect-error - heroImage required but not available in seed
      payload.create({
        collection: 'transmissions',
        draft: false,
        data: {
          title: 'The Edge of Tomorrow: Cloudflare Workers AI',
          slug: 'edge-of-tomorrow-cloudflare-workers-ai',
          excerpt: 'How vector embeddings and semantic search are revolutionizing content discovery at the edge.',
          status: 'published',
          publishedAt: new Date().toISOString(),
          author: authors[0].id,
          category: categories[0].id,
          tags: [tags[0].id, tags[3].id],
          layout: [
            {
              blockType: 'statement',
              text: 'The future of search is not keywords. It\'s meaning.',
              size: 'display',
              alignment: 'center',
            },
            {
              blockType: 'codeTerminal',
              code: `const embedding = await AI.run('@cf/baai/bge-base-en-v1.5', {
  text: ['Your content here']
})`,
              language: 'typescript',
              showLineNumbers: true,
              filename: 'generateEmbedding.ts',
            },
          ],
        },
      }),
      // @ts-expect-error - heroImage required but not available in seed
      payload.create({
        collection: 'transmissions',
        draft: false,
        data: {
          title: 'Designing for the Invisible Interface',
          slug: 'designing-invisible-interface',
          excerpt: 'The best design is the one you don\'t notice. Exploring ambient computing and zero-UI paradigms.',
          status: 'published',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          author: authors[1].id,
          category: categories[1].id,
          tags: [tags[2].id],
          layout: [
            {
              blockType: 'statement',
              text: 'Design is not just what it looks like. Design is how it works.',
              size: 'h1',
              alignment: 'left',
              attribution: 'Steve Jobs',
            },
          ],
        },
      }),
      // @ts-expect-error - heroImage required but not available in seed
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
      // @ts-expect-error - heroImage required but not available in seed
      payload.create({
        collection: 'transmissions',
        draft: false,
        data: {
          title: 'The Renaissance of the Web',
          slug: 'renaissance-of-the-web',
          excerpt: 'After years of framework fatigue, the web platform is fighting back with native solutions.',
          status: 'published',
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
          author: authors[1].id,
          category: categories[2].id,
          tags: [tags[4].id],
          layout: [
            {
              blockType: 'statement',
              text: 'The platform is the framework.',
              size: 'display',
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

  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

seed()
