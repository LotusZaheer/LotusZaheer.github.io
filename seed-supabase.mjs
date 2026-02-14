/**
 * Seed script: inserts current static data into Supabase tables.
 * Run: node seed-supabase.mjs
 */
const SUPABASE_URL = 'https://zjkonyeumyiegneaxost.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nOwKrAS0Rx9bQblHYXV3cA_gGa4DT1n';

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
};

async function insertRows(table, rows) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(rows)
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Failed to insert into ${table}: ${res.status} ${body}`);
    }
    console.log(`✅ Inserted ${rows.length} rows into "${table}"`);
}

// --- Projects ---
const projects = [
    {
        title: 'projects.beatride.title',
        description: 'projects.beatride.description',
        frameworks: ['Angular'],
        apis: ['Google Maps API'],
        libraries: ['OR-Tools', 'Pandas', 'GeoPandas', 'Numpy', 'Dask'],
        platforms: ['ESRI', 'Docker'],
        languages: ['Python', 'C++', 'TypeScript'],
        markupStyles: ['SCSS', 'HTML5'],
        company: 'OrusXpert SAS',
        companyUrl: 'https://orusxpert.co',
        role: 'projects.beatride.role',
        images: [
            './assets/images/projects/beatridemap-1.png',
            './assets/images/projects/beatridemap-2.png',
            './assets/images/projects/beatridemap-3.png',
            './assets/images/projects/beatridemap-4.png',
            './assets/images/projects/beatridemap-5.png',
            './assets/images/projects/beatridemap-6.png',
            './assets/images/projects/beatridemap-7.png',
            './assets/images/projects/beatridemap-8.png',
            './assets/images/projects/beatridemap-9.png',
            './assets/images/projects/beatridemap-10.png',
            './assets/images/projects/beatridemap-11.png',
            './assets/images/projects/beatridemap-12.png',
            './assets/images/projects/beatridemap-13.png',
            './assets/images/projects/beatridemap-14.png',
        ],
        liveUrl: 'https://beatride.co',
        featured: true,
        currentImageIndex: 0,
        progress: 0
    },
    {
        title: 'projects.fampas.title',
        description: 'projects.fampas.description',
        frameworks: ['Angular'],
        platforms: ['Docker'],
        languages: ['TypeScript'],
        markupStyles: ['SCSS', 'HTML5'],
        company: 'OrusXpert SAS',
        companyUrl: 'https://orusxpert.co',
        role: 'projects.fampas.role',
        images: [
            './assets/images/projects/fundacionfampas.png',
        ],
        liveUrl: 'https://fundacionfampas.com/',
        featured: true,
        currentImageIndex: 0,
        progress: 0
    }
];

// --- Social Networks ---
const socialNetworks = [
    {
        name: 'LinkedIn',
        nick: 'andresfuribeg',
        iconPath: 'assets/images/networks/linkedin.svg',
        url: 'https://www.linkedin.com/in/andresfuribeg/'
    }
];

// --- Contact Methods ---
const contactMethods = [
    {
        name: 'LinkedIn',
        nick: 'andresfuribeg',
        iconPath: 'assets/images/networks/linkedin.svg',
        url: 'https://www.linkedin.com/in/andresfuribeg/'
    },
    {
        name: 'Email',
        nick: 'andresfelipeuribe11@gmail.com',
        iconPath: 'assets/images/networks/gmail.svg',
        url: 'mailto:andresfelipeuribe11@gmail.com'
    },
    {
        name: 'WhatsApp',
        nick: 'WhatsApp',
        iconPath: 'assets/images/networks/whatsapp.svg',
        url: 'https://wa.me/573016561380'
    }
];

async function main() {
    console.log('🚀 Seeding Supabase...\n');
    try {
        await insertRows('projects', projects);
        await insertRows('social_networks', socialNetworks);
        await insertRows('contact_methods', contactMethods);
        console.log('\n🎉 Seed complete!');
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

main();
