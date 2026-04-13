# Community & Feedback Routing Strategy

**Balsm Healthcare Platform - Community Engagement & Issue Tracking**

---

## Overview

This document defines the routing strategy for Balsm's community platform, enabling users to share ideas, report issues, vote on feature requests, participate in discussions, and track product roadmap progress.

**Primary Subdomain**: `community.balsm.health`

**Purpose**:
- **Feature Requests**: Users propose new features and enhancements
- **Issue Tracking**: Bug reports and technical issues
- **Ideas & Feedback**: General suggestions and feedback
- **Voting System**: Community-driven prioritization
- **Discussions**: Forums for healthcare topics, best practices, use cases
- **Roadmap Transparency**: Public visibility into what's being built
- **Knowledge Base**: Community-contributed guides and solutions

---

## Subdomain Strategy

### Option 1: Dedicated Community Subdomain (Recommended)

**Domain**: `community.balsm.health`

**Rationale**:
- ✅ Encourages public participation (non-authenticated users can browse)
- ✅ Creates a distinct brand for community engagement
- ✅ Allows separate scaling and moderation systems
- ✅ Can use specialized community platforms (Discourse, Flarum)
- ✅ SEO benefits for healthcare discussions and solutions
- ✅ Clear separation from authenticated portal features

**When to Use**:
- Public platform for all Balsm users (patients, caregivers, staff)
- Open discussions visible to non-users for transparency
- Integration with roadmap and changelog

---

### Option 2: Integrated Community (Alternative)

**Route Prefix**: `portal.balsm.health/community/*`

**Rationale**:
- ✅ Simpler authentication (already logged into portal)
- ✅ Fewer domains to manage
- ❌ Less discoverable for public users
- ❌ Mixes private portal with public community features

**When to Use**:
- Internal feedback system for authenticated users only
- Private beta/early access community

---

## Recommended Approach

**Use Dedicated Subdomain** (`community.balsm.health`) for:
- Maximum engagement and transparency
- Public-facing knowledge base
- Healthcare use case discussions
- Feature voting accessible to all stakeholders

---

## URL Structure

### Base URL
```
https://community.balsm.health
```

---

## Route Definitions

### 1. Homepage & Navigation

| Route | Purpose | Authentication |
|-------|---------|----------------|
| `/` | Community homepage with recent discussions, top ideas, and featured content | Optional |
| `/trending` | Trending discussions and hot topics | Optional |
| `/search` | Search across ideas, issues, discussions, and knowledge base | Optional |
| `/popular` | Most upvoted ideas and discussions this week/month | Optional |

---

### 2. Feature Requests & Ideas

**Base Route**: `/ideas`

| Route | Purpose | Method | Authentication |
|-------|---------|--------|----------------|
| `/ideas` | Browse all feature requests | GET | Optional |
| `/ideas/new` | Submit a new feature request | GET/POST | Required |
| `/ideas/:id` | View specific feature request with discussion | GET | Optional |
| `/ideas/:id/vote` | Upvote/downvote a feature request | POST | Required |
| `/ideas/:id/comment` | Comment on a feature request | POST | Required |
| `/ideas/:id/subscribe` | Get notified on status changes | POST | Required |
| `/ideas/status/under-review` | Ideas being reviewed by team | GET | Optional |
| `/ideas/status/planned` | Ideas approved and planned | GET | Optional |
| `/ideas/status/in-progress` | Ideas currently being developed | GET | Optional |
| `/ideas/status/completed` | Implemented feature requests | GET | Optional |
| `/ideas/status/declined` | Declined requests with reasoning | GET | Optional |
| `/ideas/tags/:tag` | Filter ideas by tag (e.g., mobile, api, reports) | GET | Optional |

**Idea Statuses**:
- `submitted` - Newly submitted, awaiting review
- `under-review` - Team is evaluating
- `planned` - Approved for future development
- `in-progress` - Currently being built
- `completed` - Released in a version
- `declined` - Not planned with explanation

---

### 3. Issue Tracking & Bug Reports

**Base Route**: `/issues`

| Route | Purpose | Method | Authentication |
|-------|---------|--------|----------------|
| `/issues` | Browse all reported issues | GET | Optional |
| `/issues/new` | Report a new bug or issue | GET/POST | Required |
| `/issues/:id` | View issue details and discussion | GET | Optional |
| `/issues/:id/upvote` | Vote on issue severity/priority | POST | Required |
| `/issues/:id/comment` | Add comments or reproduction steps | POST | Required |
| `/issues/:id/workaround` | Community-contributed workarounds | POST | Required |
| `/issues/status/open` | Open/active issues | GET | Optional |
| `/issues/status/investigating` | Issues under investigation | GET | Optional |
| `/issues/status/fixed` | Fixed issues (specify version) | GET | Optional |
| `/issues/status/wont-fix` | Issues that won't be fixed (with reason) | GET | Optional |
| `/issues/severity/critical` | Critical bugs affecting core functionality | GET | Optional |
| `/issues/severity/high` | High-priority issues | GET | Optional |
| `/issues/affected-version/:version` | Issues reported for specific app version | GET | Optional |

**Issue Severities**:
- `critical` - Data loss, security vulnerability, system down
- `high` - Major feature broken
- `medium` - Minor feature broken, workaround exists
- `low` - Cosmetic or minor inconvenience

---

### 4. Discussions & Forums

**Base Route**: `/discussions`

| Route | Purpose | Method | Authentication |
|-------|---------|--------|----------------|
| `/discussions` | All discussion categories | GET | Optional |
| `/discussions/:category` | Category-specific discussions | GET | Optional |
| `/discussions/:category/new` | Start a new discussion | GET/POST | Required |
| `/discussions/:id` | View discussion thread | GET | Optional |
| `/discussions/:id/reply` | Reply to discussion | POST | Required |
| `/discussions/:id/like` | Like a discussion post | POST | Required |
| `/discussions/:id/bookmark` | Bookmark for later | POST | Required |

**Discussion Categories**:
- `general` - General healthcare IT discussions
- `use-cases` - Share how you use Balsm
- `best-practices` - Clinical workflows and best practices
- `integrations` - Third-party integrations and add-ons
- `api-development` - For developers building with Balsm API
- `troubleshooting` - Community help and support
- `announcements` - Official Balsm team announcements
- `feedback` - General platform feedback

---

### 5. Roadmap & Changelog

**Base Routes**: `/roadmap`, `/changelog`

| Route | Purpose | Method | Authentication |
|-------|---------|--------|----------------|
| `/roadmap` | Public product roadmap | GET | None |
| `/roadmap/now` | Currently in development | GET | None |
| `/roadmap/next` | Planned for next quarter | GET | None |
| `/roadmap/later` | Future backlog items | GET | None |
| `/changelog` | Release notes and updates | GET | None |
| `/changelog/:version` | Detailed release notes for version | GET | None |
| `/changelog/subscribe` | Email notifications for new releases | POST | Required |

---

### 6. User Voting & Prioritization

**Base Route**: `/votes`

| Route | Purpose | Method | Authentication |
|-------|---------|--------|----------------|
| `/votes/my-votes` | See all items you've voted on | GET | Required |
| `/votes/leaderboard` | Most-voted ideas and issues | GET | Optional |
| `/api/v1/community/votes/:itemId` | Cast or update vote | POST | Required |
| `/api/v1/community/votes/:itemId` | Remove vote | DELETE | Required |

**Voting Rules**:
- Each user gets **unlimited votes** (GitHub-style)
- Can vote on both ideas and issues
- Can change vote at any time
- Votes are weighted by user role (e.g., verified healthcare providers get 2x weight)

---

### 7. Knowledge Base (Community-Contributed)

**Base Route**: `/kb`

| Route | Purpose | Method | Authentication |
|-------|---------|--------|----------------|
| `/kb` | Knowledge base homepage | GET | None |
| `/kb/search` | Search knowledge base articles | GET | None |
| `/kb/category/:category` | Articles by category | GET | None |
| `/kb/article/:slug` | View knowledge base article | GET | None |
| `/kb/article/:slug/helpful` | Mark article as helpful | POST | Required |
| `/kb/contribute` | Submit a community guide | GET/POST | Required |
| `/kb/article/:slug/suggest-edit` | Suggest edits to an article | POST | Required |

**KB Categories**:
- `getting-started` - Onboarding guides
- `how-to` - Step-by-step tutorials
- `workflows` - Clinical workflow examples
- `troubleshooting` - Common issues and solutions
- `integrations` - Integration setup guides
- `add-ons` - Marketplace add-on documentation

---

### 8. User Profiles & Reputation

**Base Route**: `/users`

| Route | Purpose | Method | Authentication |
|-------|---------|--------|----------------|
| `/users/:username` | Public user profile | GET | None |
| `/users/:username/ideas` | User's submitted ideas | GET | None |
| `/users/:username/issues` | User's reported issues | GET | None |
| `/users/:username/discussions` | User's discussion posts | GET | None |
| `/users/:username/reputation` | Reputation score breakdown | GET | None |
| `/users/leaderboard` | Top contributors this month | GET | None |

**Reputation System**:
- **+10**: Idea implemented
- **+5**: Issue confirmed by team
- **+3**: Knowledge base article approved
- **+2**: Discussion marked as helpful by moderator
- **+1**: Upvote received on idea/issue
- **Badges**: Awarded for milestones (e.g., "First Contributor", "Bug Hunter", "Idea Champion")

---

### 9. Moderation & Administration

**Base Route**: `/admin` (restricted to moderators)

| Route | Purpose | Method | Authentication |
|-------|---------|--------|----------------|
| `/admin/dashboard` | Moderation dashboard | GET | Moderator |
| `/admin/flagged` | Flagged posts for review | GET | Moderator |
| `/admin/users/:id/suspend` | Suspend user account | POST | Admin |
| `/admin/merge-duplicates` | Merge duplicate ideas/issues | POST | Moderator |
| `/admin/bulk-update-status` | Update status for multiple items | POST | Balsm Team |

---

### 10. Notifications & Subscriptions

**Base Route**: `/notifications`

| Route | Purpose | Method | Authentication |
|-------|---------|--------|----------------|
| `/notifications` | User notification center | GET | Required |
| `/notifications/mark-read/:id` | Mark notification as read | POST | Required |
| `/notifications/settings` | Configure notification preferences | GET/PUT | Required |
| `/api/v1/community/subscriptions` | Manage subscriptions | GET/POST | Required |

**Notification Triggers**:
- Idea/issue you submitted changes status
- Someone replies to your discussion
- Idea/issue you voted on is completed
- New announcement from Balsm team
- Your knowledge base article is approved

---

## API Endpoints

### Base API URL
```
https://api.balsm.health/v1/community
```

### Ideas API

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/v1/community/ideas` | GET | List feature requests (paginated, filtered) | Optional |
| `/v1/community/ideas` | POST | Submit new feature request | Required |
| `/v1/community/ideas/:id` | GET | Get idea details with comments | Optional |
| `/v1/community/ideas/:id` | PATCH | Update idea (author only) | Required |
| `/v1/community/ideas/:id/vote` | POST | Vote on idea | Required |
| `/v1/community/ideas/:id/comments` | POST | Add comment | Required |
| `/v1/community/ideas/:id/status` | PATCH | Update status (team only) | Team |

**Request Example** (POST `/v1/community/ideas`):
```json
{
  "title": "Add medication interaction checker",
  "description": "Display warnings when prescribing medications with known interactions...",
  "category": "clinical-safety",
  "tags": ["prescriptions", "drug-database", "safety"],
  "userRole": "physician"
}
```

**Response Example**:
```json
{
  "id": "idea_7Kx2mQ9",
  "title": "Add medication interaction checker",
  "status": "submitted",
  "votes": 1,
  "comments": 0,
  "author": {
    "username": "dr_ahmed_m",
    "reputation": 245,
    "role": "verified_physician"
  },
  "createdAt": "2026-03-23T10:30:00Z",
  "url": "https://community.balsm.health/ideas/idea_7Kx2mQ9"
}
```

---

### Issues API

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/v1/community/issues` | GET | List reported issues | Optional |
| `/v1/community/issues` | POST | Report new issue | Required |
| `/v1/community/issues/:id` | GET | Get issue details | Optional |
| `/v1/community/issues/:id/upvote` | POST | Upvote issue priority | Required |
| `/v1/community/issues/:id/workaround` | POST | Add workaround | Required |

**Request Example** (POST `/v1/community/issues`):
```json
{
  "title": "App crashes when uploading large lab PDF",
  "description": "Steps to reproduce:\n1. Go to Lab Results\n2. Tap 'Upload PDF'\n3. Select file >10MB\n4. App crashes",
  "severity": "high",
  "affectedVersion": "2.5.1",
  "platform": "iOS",
  "deviceInfo": "iPhone 14 Pro, iOS 17.3"
}
```

---

### Discussions API

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/v1/community/discussions` | GET | List discussions by category | Optional |
| `/v1/community/discussions` | POST | Create new discussion | Required |
| `/v1/community/discussions/:id` | GET | Get discussion with replies | Optional |
| `/v1/community/discussions/:id/replies` | POST | Reply to discussion | Required |
| `/v1/community/discussions/:id/like` | POST | Like a discussion | Required |

---

### Voting API

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/v1/community/votes/leaderboard` | GET | Most-voted items this month | None |
| `/v1/community/votes/my-votes` | GET | Current user's votes | Required |

---

### Roadmap API (Read-Only)

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/v1/community/roadmap` | GET | Get public roadmap items | None |
| `/v1/community/roadmap/:id` | GET | Get roadmap item details | None |
| `/v1/community/changelog` | GET | Get release notes | None |
| `/v1/community/changelog/:version` | GET | Get release notes for version | None |

---

## Technology Stack

### Recommended Platform

**Option 1: Discourse (Recommended)**
- **Pros**: Purpose-built for community discussions, excellent moderation tools, voting plugins, SSO integration
- **Cons**: Requires separate hosting, Rails-based (different from .NET stack)
- **Hosting**: Self-hosted or Discourse hosting service
- **Integration**: OAuth SSO with Balsm identity system

**Option 2: Custom .NET Solution**
- **Pros**: Full control, consistent tech stack, tight integration with Balsm API
- **Cons**: More development effort, need to build moderation tools
- **Stack**: ASP.NET Core + PostgreSQL + Vue.js/React
- **Components**:
  - Entity framework for data models
  - SignalR for real-time updates
  - Markdown rendering (Markdig)
  - Full-text search (PostgreSQL or Elasticsearch)

**Option 3: Flarum**
- **Pros**: Modern, lightweight, extensible, MIT license
- **Cons**: PHP-based, smaller ecosystem than Discourse
- **Hosting**: Self-hosted
- **Integration**: Custom extension for SSO

**Recommendation**: Start with **Discourse** for faster time-to-market, then consider custom solution if advanced integration is needed.

---

### Frontend Features

- **Rich Text Editor**: Markdown with live preview (e.g., EasyMDE, SimpleMDE)
- **Syntax Highlighting**: For code snippets in discussions (e.g., Prism.js)
- **Real-Time Updates**: WebSockets for live vote counts and new comments
- **Image Upload**: Cloudinary or S3 for screenshots in bug reports
- **Tagging System**: Auto-suggest tags based on content
- **Search**: Full-text search with filters (status, category, date range)
- **Mobile Responsive**: Optimized for mobile browsers and app webview

---

## Authentication & Permissions

### Authentication Strategy

**SSO Integration**: Users log in with their Balsm account
- OAuth 2.0 / OpenID Connect flow
- Single session across `portal.balsm.health` and `community.balsm.health`
- Optional social login (Google, GitHub) for non-Balsm users who want to contribute

### Permission Levels

| Role | Permissions |
|------|-------------|
| **Anonymous** | Browse ideas, issues, discussions, roadmap; search knowledge base |
| **Registered User** | Submit ideas, report issues, vote, comment, bookmark |
| **Verified Healthcare Professional** | 2x vote weight, verified badge, priority in discussions |
| **Contributor** (10+ helpful posts) | Edit own posts after 5 min, suggest KB edits |
| **Moderator** | Edit/delete any post, merge duplicates, manage flags, assign status |
| **Balsm Team** | Update idea/issue status, post announcements, manage roadmap |
| **Admin** | Full access, user management, community configuration |

**Verification Process**:
- Healthcare professionals can verify credentials (medical license, nursing certificate)
- Verified users get a badge and increased voting weight
- Helps prioritize feedback from actual clinical users

---

## Moderation & Community Guidelines

### Content Moderation

**Automated Moderation**:
- Spam detection (link patterns, repeated posts)
- Profanity filter (configurable)
- Rate limiting (e.g., max 5 new discussions per day per user)
- Duplicate detection (warn before posting similar ideas/issues)

**Manual Moderation**:
- Flag for review (inappropriate, off-topic, duplicate)
- Moderator queue for flagged content
- Ban/suspend abusive users
- Merge duplicate ideas and issues

### Community Guidelines

**Code of Conduct**:
- Respectful and professional communication
- No PHI (Protected Health Information) sharing — enforce strictly
- Constructive criticism only
- No spam or self-promotion
- Search before posting to avoid duplicates

**Consequences**:
- 1st violation: Warning + content removal
- 2nd violation: 7-day suspension
- 3rd violation: Permanent ban

---

## Integration with Balsm Ecosystem

### 1. Portal Integration

**Banner Notifications** in `portal.balsm.health`:
- "Your feature request 'X' is now in progress! View roadmap →"
- "New version 2.6.0 released with 5 community-requested features →"

**Feedback Widget**:
- Quick link in portal footer: "Submit Feedback" → `community.balsm.health/ideas/new`
- In-app bug report button → `community.balsm.health/issues/new` (pre-filled with version/device info)

---

### 2. Email Notifications

**Notification Types**:
- Status change on your idea/issue
- Reply to your discussion
- Weekly digest of trending ideas
- Monthly newsletter with roadmap updates

**Preference Controls**: `/notifications/settings`
- Email frequency (instant, daily, weekly)
- Categories to follow
- Mention notifications

---

### 3. Slack/Discord Integration (Future)

**For Balsm Team**:
- New high-priority ideas/issues posted to #community-feedback Slack channel
- Daily summary of votes and trending topics

**For Public**:
- Optional Discord server for real-time discussions
- Bridge between Discord and `community.balsm.health/discussions`

---

### 4. Developer Portal Integration

**Link from `developers.balsm.health`**:
- "API Feature Requests" → `community.balsm.health/ideas?tag=api`
- "SDK Issues" → `community.balsm.health/issues?tag=sdk`

---

## Analytics & Metrics

### Community Health Metrics

**Track**:
- Monthly active contributors
- Ideas submitted vs. ideas implemented (conversion rate)
- Average time from submission to status change
- Top contributors (reputation leaderboard)
- Most-voted ideas that haven't been addressed
- Issue response time (team acknowledgment)

**Dashboard**: `/admin/analytics` (for Balsm team)

---

### Public Transparency

**Publicly Visible Metrics**:
- Total ideas submitted
- Ideas implemented this quarter
- Average implementation time
- Top contributors this month

**Route**: `community.balsm.health/stats`

---

## Search & Discovery

### Search Features

**Full-Text Search**:
- Search across ideas, issues, discussions, knowledge base
- Filters: status, category, date range, votes, author
- Sort: relevance, votes, recent, trending

**Advanced Filters**:
```
/search?q=prescription&type=idea&status=planned&sort=votes
```

**Suggested Searches**:
- "Most voted ideas this month"
- "Open critical issues"
- "Completed feature requests"

---

### Trending Algorithm

**Factors**:
- Recent votes (last 7 days)
- Comment activity
- View count
- Recency bias (newer items get boost)

**Formula**:
```
score = (votes * 2 + comments * 1.5 + views * 0.1) / age_in_days^1.5
```

---

## Gamification & Engagement

### Reputation System

**Earn Reputation**:
- +10: Idea implemented
- +5: Issue confirmed by team
- +3: Knowledge base article approved
- +2: Discussion marked helpful by moderator
- +1: Upvote on your content
- +1: Daily login streak (max 7 days)

**Reputation Levels**:
- 0-49: Newcomer
- 50-199: Contributor
- 200-499: Active Contributor
- 500-999: Community Leader
- 1000+: Community Champion

---

### Badges

**Achievement Badges**:
- **First Contribution**: Submit first idea or issue
- **Bug Hunter**: Report 5 confirmed bugs
- **Idea Champion**: Have 3 ideas implemented
- **Helpful**: 10 helpful answers in discussions
- **Verified Professional**: Complete healthcare credential verification
- **Early Adopter**: Registered in first month of community launch

**Display**: On user profile and next to username in posts

---

## Mobile Experience

### Mobile Web Optimization

- Responsive design (mobile-first)
- Touch-optimized voting buttons
- Swipe gestures for navigation
- Lazy loading for long discussion threads
- Offline reading (service worker cache)

### In-App WebView

**Route**: `app.balsm.health/community` → webview to `community.balsm.health`
- Auto-login with app session token
- Native share sheet integration
- Pre-fill bug reports with device info from Flutter app

---

## Security & Privacy

### No PHI Policy (Critical)

**Strict Enforcement**:
- Clear warning on submission forms: "Do NOT include patient names, IDs, or any protected health information"
- Automated scanning for patterns (e.g., email addresses, phone numbers)
- Moderator review of flagged posts
- Report button for PHI violations

**Consequences**:
- Immediate post removal
- User suspension
- Audit trail for compliance

---

### Data Privacy

**GDPR Compliance**:
- Export all user data: `/users/me/export`
- Delete account: `/users/me/delete` (anonymize posts, or delete if <3 days old)
- Cookie consent banner
- Privacy policy link in footer

---

## Launch Strategy

### Phase 1: MVP (Month 1-2)

**Features**:
- ✅ Ideas submission and voting
- ✅ Issue reporting
- ✅ Basic discussions (1-2 categories)
- ✅ Public roadmap
- ✅ Simple search

**Technology**: Discourse (self-hosted)

---

### Phase 2: Engagement (Month 3-4)

**Features**:
- ✅ Reputation system
- ✅ Badges
- ✅ Knowledge base
- ✅ Email notifications
- ✅ Advanced search

---

### Phase 3: Integration (Month 5-6)

**Features**:
- ✅ Portal integration (feedback widget)
- ✅ In-app bug reporting
- ✅ Slack/Discord integration
- ✅ Analytics dashboard
- ✅ Moderator tools

---

### Phase 4: Scale (Month 7+)

**Features**:
- ✅ Custom .NET platform (if needed)
- ✅ Advanced moderation (AI-assisted)
- ✅ Multi-language support
- ✅ Mobile app integration (deep links)
- ✅ API for third-party integrations

---

## SEO & Discoverability

### SEO Optimization

**Meta Tags**:
```html
<title>Medication Interaction Checker - Feature Request | Balsm Community</title>
<meta name="description" content="Join the discussion on adding a medication interaction checker to Balsm. Vote and share your thoughts.">
<meta property="og:image" content="https://community.balsm.health/og/idea_7Kx2mQ9.png">
```

**Structured Data** (Schema.org):
```json
{
  "@context": "https://schema.org",
  "@type": "DiscussionForumPosting",
  "headline": "Medication Interaction Checker",
  "author": {
    "@type": "Person",
    "name": "Dr. Ahmed M."
  },
  "datePublished": "2026-03-23",
  "interactionCount": "42 votes"
}
```

**Canonical URLs**: All posts have clean, SEO-friendly URLs
```
https://community.balsm.health/ideas/medication-interaction-checker-idea_7Kx2mQ9
```

---

### Sitemap

**Route**: `/sitemap.xml`

**Include**:
- All public ideas, issues, discussions
- Knowledge base articles
- Roadmap page
- Changelog entries

**Update Frequency**: Daily

---

## Compliance & Legal

### Terms of Service

**Route**: `community.balsm.health/terms`

**Key Points**:
- No PHI posting (enforced strictly)
- Content license (user-generated content is CC BY 4.0)
- Moderation rights
- User conduct expectations

---

### Privacy Policy

**Route**: `community.balsm.health/privacy`

**Data Collected**:
- Account info (username, email, profile)
- Posts, comments, votes
- Analytics (page views, session duration)

**Third-Party Services**:
- Authentication (OAuth)
- Email (SendGrid)
- Analytics (self-hosted Matomo or privacy-focused alternative)

---

## Monitoring & Support

### Health Monitoring

**Metrics**:
- Response time (p50, p95, p99)
- Uptime (target: 99.9%)
- Error rate
- Search query performance

**Alerts**:
- Downtime > 5 minutes
- Error rate > 1%
- Spam surge detection

---

### Community Support

**Moderator Availability**:
- Business hours monitoring (9 AM - 6 PM)
- After-hours escalation for critical issues (PHI violations)

**Support Routes**:
- `/help` - Community help center
- `/contact` - Contact Balsm team
- `/report` - Report abuse or violations

---

## Example User Journeys

### Journey 1: Submit Feature Request

1. User visits `community.balsm.health`
2. Browses `/ideas` to check for duplicates
3. Clicks "Submit Idea"
4. Fills form (title, description, category, tags)
5. Submits → Redirects to `/ideas/idea_ABC123`
6. Receives email: "Your idea is under review"
7. Team changes status to "Planned" → Email notification
8. Idea implemented in v2.7.0 → Email: "Your idea is live!"

---

### Journey 2: Report Bug

1. User encounters crash in mobile app
2. Taps "Report Bug" in app → Opens webview to `community.balsm.health/issues/new` (pre-filled with version, device)
3. Adds description and steps to reproduce
4. Submits issue
5. Moderator confirms bug → Status: "Investigating"
6. Another user adds workaround → Notification
7. Bug fixed in v2.6.1 → Email with changelog link

---

### Journey 3: Engage in Discussion

1. User visits `community.balsm.health/discussions/best-practices`
2. Reads discussion: "How to optimize patient intake workflow"
3. Replies with their clinic's workflow
4. Other users upvote reply → +1 reputation
5. Moderator marks reply as "Helpful" → +2 reputation
6. User reaches 50 reputation → Unlocks "Contributor" badge

---

## Future Enhancements

### Advanced Features (Future)

- **AI-Powered Duplicate Detection**: Suggest existing ideas/issues before submission
- **Sentiment Analysis**: Track community sentiment over time
- **Video Attachments**: Allow screen recordings for bug reports
- **Live Q&A Sessions**: Host AMA (Ask Me Anything) with Balsm founders
- **Bounty System**: Offer rewards for critical bug reports
- **Developer Sandbox**: Test API integrations and share results in discussions
- **Community Challenges**: Monthly challenges (e.g., "Best add-on idea")
- **Translation Crowdsourcing**: Community helps translate Balsm into new languages

---

## Success Metrics

### Community Health KPIs

**Engagement**:
- Target: 500+ monthly active users in Year 1
- Target: 50+ ideas submitted per month
- Target: 20+ issues reported per month
- Target: 80% response rate from Balsm team within 48 hours

**Implementation**:
- Target: 10% idea implementation rate (1 in 10 ideas gets built)
- Target: Average 30 days from "Planned" to "Completed"

**Satisfaction**:
- Target: 4.5+/5 community satisfaction score
- Target: NPS > 50 for community experience

---

## Documentation & Resources

### For Users

- **Getting Started Guide**: `community.balsm.health/guide/getting-started`
- **Community Guidelines**: `community.balsm.health/guidelines`
- **FAQ**: `community.balsm.health/faq`

### For Moderators

- **Moderation Handbook**: Internal wiki
- **Flag Resolution SLA**: Respond within 24 hours

### For Developers

- **API Documentation**: `developers.balsm.health/community-api`
- **Webhooks**: Subscribe to idea status changes via webhook

---

## Conclusion

The community subdomain (`community.balsm.health`) creates a transparent, engaging platform for users to:
- **Shape the product**: Vote on features and report bugs
- **Share knowledge**: Contribute to discussions and knowledge base
- **Stay informed**: Track roadmap and changelog
- **Build reputation**: Earn recognition for helpful contributions

**Key Differentiators**:
- Healthcare-focused moderation (strict PHI enforcement)
- Verified professional badges for credibility
- Direct integration with Balsm roadmap and development process
- Transparency through public roadmap and metrics

**Next Steps**:
1. Choose community platform (Discourse recommended)
2. Set up SSO integration with Balsm identity system
3. Configure moderation workflows and train moderators
4. Launch MVP with ideas and issues features
5. Promote to existing Balsm users via email and in-app banners

---

*Document Version: 1.0*
*Last Updated: 2026-03-23*
*Owner: Product & Community Team*
