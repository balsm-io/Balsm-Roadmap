import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Balsm Roadmap',
  description: 'Balsm Healthcare Platform — Architecture, Specs & Delivery Roadmap',

  srcExclude: [
    '.claude/**',
    '.cursor/**',
    '.windsurf/**',
    '.specify/**',
    '.github/**',
    'node_modules/**',
    'balsm/**',
  ],

  markdown: {
    math: false,
  },

  ignoreDeadLinks: [
    /\.mmd$/,           // mermaid source files are not served pages
    /BUSINESS_FEATURES/ // cross-repo link in Balsm-Draft
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Overview', link: '/' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'Personas', link: '/personas/' },
      { text: 'Specs', link: '/specs/001-server-foundation/spec' },
      { text: 'Validations', link: '/validations/customer' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Phased Delivery', link: '/PHASED_DELIVERY_STEPS' },
          { text: 'Glossary', link: '/GLOSSARY' },
          { text: 'Non-Functional Requirements', link: '/NON_FUNCTIONAL_REQUIREMENTS' },
          { text: 'Migration & Integration', link: '/MIGRATION_INTEGRATION_GUIDE' },
        ],
      },
      {
        text: 'Architecture',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/architecture/' },
          { text: 'C4 Model', link: '/architecture/c4-model' },
          { text: 'Communication Architecture', link: '/architecture/communication-architecture' },
          {
            text: 'Subdomain & Routing',
            collapsed: true,
            items: [
              { text: 'Subdomain Map', link: '/architecture/subdomain-map' },
              { text: 'Subdomain Classification', link: '/architecture/subdomain-classification' },
              { text: 'Route Mapping', link: '/architecture/subdomain-route-mapping' },
              { text: 'API Routing', link: '/architecture/api-routing-strategy' },
              { text: 'Authentication Routing', link: '/architecture/authentication-routing-strategy' },
              { text: 'Community Routing', link: '/architecture/community-routing-strategy' },
              { text: 'Documentation Routing', link: '/architecture/documentation-routing-strategy' },
              { text: 'Download Routing', link: '/architecture/download-routing-strategy' },
              { text: 'Legal & Consent Routing', link: '/architecture/legal-consent-routing-strategy' },
              { text: 'Payment Routing', link: '/architecture/payment-routing-strategy' },
              { text: 'Share Routing', link: '/architecture/share-routing-strategy' },
              { text: 'Website Routing', link: '/architecture/website-routing-strategy' },
            ],
          },
        ],
      },
      {
        text: 'Agent Rules',
        collapsed: true,
        items: [
          { text: 'AGENTS', link: '/agents/rules/AGENTS' },
          { text: 'Coding Standards', link: '/agents/rules/CODING_STANDARDS' },
          { text: 'UI Design', link: '/agents/rules/UI_DESIGN' },
        ],
      },
      {
        text: 'Governance & AI',
        collapsed: true,
        items: [
          { text: 'AI Governance', link: '/AI_GOVERNANCE' },
          { text: 'System Threat Model', link: '/SYSTEM_THREAT_MODEL' },
        ],
      },
      {
        text: 'Phase 001 — Server Foundation',
        collapsed: false,
        items: [
          { text: 'Spec', link: '/specs/001-server-foundation/spec' },
          { text: 'Plan', link: '/specs/001-server-foundation/plan' },
          { text: 'Tasks', link: '/specs/001-server-foundation/tasks' },
          { text: 'Data Model', link: '/specs/001-server-foundation/data-model' },
          { text: 'Quickstart', link: '/specs/001-server-foundation/quickstart' },
          { text: 'Research', link: '/specs/001-server-foundation/research' },
          { text: 'REST API Contract', link: '/specs/001-server-foundation/contracts/rest-api' },
          { text: 'Requirements Checklist', link: '/specs/001-server-foundation/checklists/requirements' },
        ],
      },
      {
        text: 'Personas',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/personas/' },
          {
            text: 'Balsm App',
            collapsed: false,
            items: [
              { text: 'Patient', link: '/personas/patient' },
              { text: 'Caregiver', link: '/personas/caregiver' },
            ],
          },
          {
            text: 'Balsm Pro',
            collapsed: false,
            items: [
              { text: 'Doctor', link: '/personas/doctor' },
              { text: 'Nurse', link: '/personas/nurse' },
              { text: 'Pharmacist', link: '/personas/pharmacist' },
              { text: 'Cashier', link: '/personas/cashier' },
              { text: 'Receptionist', link: '/personas/receptionist' },
              { text: 'Lab Technician', link: '/personas/lab-technician' },
              { text: 'Radiologist', link: '/personas/radiologist' },
              { text: 'Inventory Manager', link: '/personas/inventory-manager' },
              { text: 'Accountant', link: '/personas/accountant' },
              { text: 'Entity Admin', link: '/personas/entity-admin' },
            ],
          },
          {
            text: 'Balsm Connect',
            collapsed: false,
            items: [
              { text: 'Partner', link: '/personas/partner' },
            ],
          },
          {
            text: 'Admin UI',
            collapsed: false,
            items: [
              { text: 'System Administrator', link: '/personas/system-admin' },
            ],
          },
        ],
      },
      {
        text: 'Validations',
        collapsed: true,
        items: [
          { text: 'Customer', link: '/validations/customer' },
          { text: 'Entity Management', link: '/validations/entity_management' },
          { text: 'Identity & Access', link: '/validations/identity_access' },
          { text: 'Inventory', link: '/validations/inventory' },
          { text: 'POS', link: '/validations/pos' },
          { text: 'Prescription Record', link: '/validations/prescription_record' },
        ],
      },
      {
        text: 'Legal',
        collapsed: true,
        items: [
          { text: 'Commercial License (BCL v1.4)', link: '/legal/baslm-commercial-license-bcl-v1.4' },
          { text: 'Contributor License Agreement', link: '/legal/cla' },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/balsm-io/Balsm-Roadmap' },
    ],

    editLink: {
      pattern: 'https://github.com/balsm-io/Balsm-Roadmap/edit/main/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Balsm Healthcare Platform',
      copyright: 'Copyright © 2024-present Balsm',
    },
  },
})
