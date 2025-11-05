import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'SkyGuyver Documentation',
  description: 'Voice AI Platform Developer Manual',
  
  // Clean URLs
  cleanUrls: true,
  
  // Base URL for deployment (leave empty for root domain)
  base: '/',
  
  // Ignore dead links for now (we can fix these later)
  ignoreDeadLinks: true,
  
  // Theme configuration
  themeConfig: {
    // Site title in navigation
    siteTitle: 'SkyGuyver Docs',
    
    // Logo
    logo: '/logo.svg',
    
    // Navigation menu
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'Supabase', link: '/supabase/' },
      { text: 'Workflows', link: '/workflows/' },
      { text: 'New Ideas', link: '/new-ideas/' },
      { text: 'Operations', link: '/operations/' }
    ],

    // Sidebar navigation
    sidebar: {
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/architecture/' }
          ]
        }
      ],
      
      '/supabase/': [
        {
          text: 'Supabase',
          items: [
            { text: 'Overview', link: '/supabase/' },
            {
              text: 'Tables',
              items: [
                { text: 'Client Subscriptions', link: '/supabase/tables/client-subscriptions' },
                { text: 'User Sessions', link: '/supabase/tables/user-sessions' },
                { text: 'Subscription Plans', link: '/supabase/tables/subscription-plans' },
                { text: 'Call Validation Logs', link: '/supabase/tables/call-validation-logs' }
              ]
            }
          ]
        }
      ],
      
      '/workflows/': [
        {
          text: 'Workflows',
          items: [
            { text: 'Overview', link: '/workflows/' },
            { text: 'n8n Integration', link: '/workflows/n8n/' },
            { text: 'Vapi End of Call Report', link: '/workflows/n8n/workflow-vapi-end-of-call-report' }
          ]
        }
      ],
      
      '/new-ideas/': [
        {
          text: 'New Ideas',
          items: [
            { text: 'Overview', link: '/new-ideas/' },
            {
              text: 'Outbound Lead Calling',
              items: [
                { text: 'Business Plan', link: '/new-ideas/outbound-lead-calling/' },
                { text: 'AIL NZ Opportunity', link: '/new-ideas/outbound-lead-calling/ail-nz' }
              ]
            }
          ]
        }
      ],
      
      '/operations/': [
        {
          text: 'Operations',
          items: [
            { text: 'Overview', link: '/operations/' },
            { text: 'Expenses & Costs', link: '/operations/expenses-and-costs' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/skyguyver' }
    ],

    // Footer
    footer: {
      message: 'SkyGuyver Voice AI Platform Documentation',
      copyright: 'Copyright © 2025 SkyGuyver'
    },

    // Search
    search: {
      provider: 'local'
    },

    // Edit link
    editLink: {
      pattern: 'https://github.com/yourusername/skyguyver-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    // Last updated
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  },

  // Markdown configuration
  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  },

  // Build configuration
  vite: {
    publicDir: '../public'
  }
})