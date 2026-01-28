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
    // Complete
    // ============================================
    console.log('')
    console.log('🎉 Seed complete!')
    console.log('')
    console.log('📊 Summary:')
    console.log(`   • Authors: ${authors.length}`)
    console.log(`   • Categories: ${categories.length}`)
    console.log(`   • Tags: ${tags.length}`)
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
