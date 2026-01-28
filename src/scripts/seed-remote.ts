/**
 * Remote Seed Script
 *
 * Seeds the production Payload CMS instance using the REST API.
 * Uploads images to R2 via the Media endpoint and creates sample content.
 *
 * Run with: npx tsx src/scripts/seed-remote.ts
 */

import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const API_URL = 'https://soni-cms.soniglf.workers.dev' // Worker URL
// const API_URL = 'https://soninewmedia.com' // Alternate Custom Domain

const START_USER = {
  email: 'admin@soninewmedia.com',
  password: 'Admin123!@#',
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const assetsDir = path.join(dirname, 'assets')

async function seedRemote() {
  console.log(`🌱 Starting remote seed against ${API_URL}...`)

  try {
    // 1. Login or Create First User
    let token = ''
    try {
      console.log('🔑 Logging in...')
      const loginRes = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(START_USER),
      })

      if (loginRes.ok) {
        const data = (await loginRes.json()) as any
        token = data.token
        console.log('   ✅ Logged in successfully')
      } else {
        // Attempt create first user
        console.log('   ⚠️ Login failed, attempting to create first user...')
        const createRes = await fetch(`${API_URL}/api/users/first-register`, {
          // Payload special endpoint? No, usually just create.
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...START_USER, name: 'Admin', roles: ['admin'] }),
        })

        // If first-register isn't enabled/standard, try standard create (works if no users exist usually)
        if (!createRes.ok) {
          // Check if /api/users count is 0?
          // Just try simple create
          const simpleCreate = await fetch(`${API_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...START_USER, name: 'Admin', roles: ['admin'] }),
          })

          if (simpleCreate.ok) {
            const data = (await simpleCreate.json()) as any
            token =
              data.token ||
              (
                (await (
                  await fetch(`${API_URL}/api/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(START_USER),
                  })
                ).json()) as any
              ).token
            console.log('   ✅ Created initial admin user')
          } else {
            throw new Error(
              `Failed to login or create user. Status: ${simpleCreate.status} ${simpleCreate.statusText}`,
            )
          }
        }
      }
    } catch (e) {
      console.error('Auth Error:', e)
      throw e
    }

    const headers = {
      Authorization: `JWT ${token}`,
    }

    // 2. Upload Media
    console.log('🖼️  Uploading Images to R2...')
    const mediaMap = new Map()
    const images = [
      { file: 'welcome-tech.png', alt: 'Abstract digital landscape with glowing connections' },
      { file: 'design-system.png', alt: 'Geometric glassmorphism shapes in dark void' },
      { file: 'ai-future.png', alt: 'Neural network data flow visualization' },
    ]

    for (const img of images) {
      const filePath = path.join(assetsDir, img.file)
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath)
        const blob = new Blob([fileBuffer], { type: 'image/png' })
        const formData = new FormData()
        formData.append('file', blob, img.file)
        formData.append('altText', img.alt)

        const res = await fetch(`${API_URL}/api/media`, {
          method: 'POST',
          headers: { Authorization: `JWT ${token}` }, // FormData sets boundary automatically
          body: formData,
        })

        if (res.ok) {
          const doc = (await res.json()) as any
          mediaMap.set(img.file, doc.doc.id)
          console.log(`   ✅ Uploaded ${img.file} -> ID: ${doc.doc.id}`)
        } else {
          console.error(`   ❌ Failed to upload ${img.file}:`, await res.text())
        }
      } else {
        console.warn(`   ⚠️ File not found: ${filePath}`)
      }
    }

    // 3. Create Metadata (Authors, Categories, Tags)
    // Helper
    const createDoc = async (slug: string, data: any, uniqueField = 'slug') => {
      // Check exist
      const query = await fetch(
        `${API_URL}/api/${slug}?where[${uniqueField}][equals]=${data[uniqueField]}`,
        { headers },
      )
      const queryData = (await query.json()) as any

      if (queryData.docs && queryData.docs.length > 0) {
        const id = queryData.docs[0].id
        console.log(`   🔄 Updating existing ${slug}: ${data[uniqueField]} (ID: ${id})`)

        // Update the existing document
        await fetch(`${API_URL}/api/${slug}/${id}`, {
          method: 'PATCH',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        return id
      }

      const res = await fetch(`${API_URL}/api/${slug}`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = (await res.json()) as any
      return json.doc.id
    }

    console.log('📝 Creating Metadata...')
    const authorId = await createDoc(
      'authors',
      {
        name: 'Soni Gupta',
        role: 'Founder & Creative Director',
        status: 'active',
        email: 'soni@example.com',
      },
      'email',
    ) // authors usually don't have slug
    const categoryTech = await createDoc('categories', {
      title: 'Technology',
      slug: 'technology',
      accentColor: '#6366F1',
    })
    const categoryDesign = await createDoc('categories', {
      title: 'Design',
      slug: 'design',
      accentColor: '#EC4899',
    })

    // Tags
    const tagAI = await createDoc('tags', { title: 'AI', slug: 'ai' })
    const tagWeb3 = await createDoc('tags', { title: 'Web3', slug: 'web3' })
    const tagCloudflare = await createDoc('tags', { title: 'Cloudflare', slug: 'cloudflare' })
    const tagNext = await createDoc('tags', { title: 'Next.js', slug: 'nextjs' })

    // 4. Create Transmissions
    console.log('📡 Creating Transmissions...')

    // Transmission 1
    await createDoc('transmissions', {
      title: 'Welcome to Soni New Media',
      slug: 'welcome',
      excerpt: 'A first look at the new digital frontier.',
      status: 'published',
      publishedAt: new Date().toISOString(),
      author: authorId,
      category: categoryTech,
      tags: [tagAI, tagCloudflare],
      heroImage: mediaMap.get('welcome-tech.png'),
      layout: [
        {
          blockType: 'statement',
          text: "The future of search is not keywords. It's meaning.",
          size: 'h2',
          alignment: 'center',
        },
        {
          blockType: 'codeTerminal',
          code: `// Generate embedding using Workers AI\nconst embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {\n  text: [doc.title + ' ' + doc.excerpt]\n})`,
          language: 'typescript',
          filename: 'generateEmbedding.ts',
        },
      ],
    })
    console.log('   ✅ Created "Welcome to Soni New Media"')

    // Transmission 2
    await createDoc('transmissions', {
      title: 'Design Systems',
      slug: 'design-systems',
      excerpt: 'Building consistent and scalable UIs.',
      status: 'published',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      author: authorId,
      category: categoryDesign,
      tags: [tagNext],
      heroImage: mediaMap.get('design-system.png'),
      layout: [
        {
          blockType: 'statement',
          text: 'Design is not just what it looks like. Design is how it works.',
          size: 'h2',
          alignment: 'center',
          attribution: 'Steve Jobs',
        },
      ],
    })
    console.log('   ✅ Created "Design Systems"')

    // Transmission 3 (Future)
    await createDoc('transmissions', {
      title: 'The Future of AI',
      slug: 'future-of-ai',
      excerpt: 'Exploring the intersection of code and cognition.',
      status: 'published',
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      author: authorId,
      category: categoryTech,
      tags: [tagAI, tagWeb3],
      heroImage: mediaMap.get('ai-future.png'),
      layout: [
        {
          blockType: 'statement',
          text: 'The platform is the framework.',
          size: 'h1',
          alignment: 'center',
        },
      ],
    })
    console.log('   ✅ Created "The Future of AI"')

    console.log('\n🎉 Remote Seed Complete!')
  } catch (err) {
    console.error('Script Error:', err)
  }
}

seedRemote()
