# MVP Project Brief: AI-Powered News Aggregation & Publication Platform

## Mission

Build a minimal viable monorepo system that transforms external news articles into original, AI-adapted content with custom imagery—fully automated from link submission to publication.

---

## Technical Architecture

### Stack Requirements

- **Monorepo**: Turborepo structure
- **Apps**:
  1. Next.js frontend (App Router, TypeScript)
  2. Strapi v4 CMS (content database + API)
  3. N8N workflow automation (self-hosted or cloud)

### Core Dependencies

- Next.js 14+ with TypeScript
- Strapi v4 (latest stable)
- N8N (latest)
- Google Gemini API integration
- Imagen 3 API (Google Cloud)

---

## MVP Scope: Single Critical Flow

### User Journey

1. User visits `/gerador-de-noticia`
2. Pastes external news URL into input field
3. Submits → triggers N8N webhook
4. System processes asynchronously
5. User receives published article link: `/noticias/[slug]`

### Backend Automation Flow (N8N)

**Trigger**: Webhook receives `{ url: string }`

**Steps**:

1. **Fetch & Extract** → Scrape article content from provided URL
2. **AI Adaptation** → Send raw text to Gemini API with prompt:
   - Rewrite article maintaining facts
   - Adopt journalistic tone
   - Output markdown format
   - Generate SEO-friendly slug
3. **Image Generation** → Send article summary to Imagen 3:
   - Generate photorealistic featured image
   - Return image URL/base64
4. **Strapi Publication** → POST to Strapi API:
   ```json
   {
     "title": "string",
     "slug": "string",
     "content": "markdown",
     "featuredImage": "url",
     "publishedAt": "ISO date"
   }
   ```
5. **Response** → Return `{ success: true, slug: "article-slug" }`

---

## Frontend Requirements

### Page 1: `/gerador-de-noticia`

**Purpose**: Input interface

**UI Elements**:

- Single input field: "Insira aqui o link da notícia"
- Submit button
- Loading state with progress indicator
- Success state showing published link
- Error handling (invalid URL, timeout, API failures)

**Behavior**:

- Client-side URL validation
- POST to N8N webhook endpoint
- Poll for completion or use webhook callback
- Display `/noticias/[slug]` link on success

### Page 2: `/noticias`

**Purpose**: News listing

**Requirements**:

- Fetch all published articles from Strapi API (`/api/articles?sort=publishedAt:desc`)
- Display grid/list with:
  - Featured image
  - Title
  - Excerpt (first 150 chars)
  - Published date
  - Link to detail page
- Pagination (10 items per page)

### Page 3: `/noticias/[slug]`

**Purpose**: Article detail

**Requirements**:

- Fetch single article by slug from Strapi
- Render markdown content
- Display featured image
- Metadata (title, description, OG tags)
- 404 handling for non-existent slugs

---

## Strapi CMS Configuration

### Content Type: `Article`

```typescript
{
  title: string (required)
  slug: string (unique, required)
  content: richtext/markdown (required)
  featuredImage: media (single, required)
  excerpt: text (auto-generated from content)
  publishedAt: datetime
  sourceUrl: string (original article reference)
}
```

### API Endpoints

- `GET /api/articles` → List all
- `GET /api/articles/:slug` → Single article
- `POST /api/articles` → Create (webhook auth only)

### Permissions

- Public: Read access only
- Webhook token: Write access via API key

---

## N8N Workflow Design

### Nodes Required

1. **Webhook Trigger** (POST endpoint)
2. **HTTP Request** (fetch source article)
3. **Gemini API - Text** (adapt content)
4. **Gemini API - Image** (generate visual)
5. **Strapi API** (publish article)
6. **Response** (return result to frontend)

### Error Handling

- Timeout limits (60s max per API call)
- Retry logic (3 attempts with exponential backoff)
- Fallback responses for API failures
- Detailed error messages for debugging

---

## Critical Success Criteria

### MVP Must:

1. ✅ Accept news URL via web form
2. ✅ Generate original markdown content via Gemini
3. ✅ Create photorealistic image via Imagen 3
4. ✅ Publish to Strapi automatically
5. ✅ Display published article at `/noticias/[slug]`
6. ✅ List all articles at `/noticias`

### MVP Must NOT:

- ❌ User authentication (public access only)
- ❌ Manual content editing (automation only)
- ❌ Comments/social features
- ❌ Advanced SEO tools (basic meta tags only)
- ❌ Analytics integration

---

## Configuration Checklist

### Before Development

- [ ] Create Google Cloud project
- [ ] Enable Gemini API + Imagen 3 API
- [ ] Generate API keys
- [ ] Deploy N8N instance (cloud or Docker)
- [ ] Configure Strapi database (PostgreSQL recommended)
- [ ] Set up monorepo structure with Turborepo

### Environment Variables

```bash
# N8N
N8N_WEBHOOK_URL=
N8N_API_KEY=

# Strapi
STRAPI_URL=
STRAPI_API_TOKEN=

# Google APIs
GEMINI_API_KEY=
IMAGEN_API_KEY=
```

---

## Development Phases

### Phase 1: Infrastructure (Day 1)

- Initialize Turborepo
- Set up Next.js + Strapi + N8N apps
- Configure shared TypeScript types
- Deploy Strapi locally

### Phase 2: Core Flow (Days 2-3)

- Build N8N workflow (test with manual triggers)
- Integrate Gemini text generation
- Integrate Imagen 3 image generation
- Connect Strapi API endpoints

### Phase 3: Frontend (Day 4)

- Build `/gerador-de-noticia` form
- Implement webhook submission logic
- Create `/noticias` listing page
- Build `[slug]` detail page

### Phase 4: Testing (Day 5)

- End-to-end flow validation
- Error scenario testing
- Performance checks (API timeouts)
- Content quality review

---

## Key Risks & Mitigations

| Risk                      | Impact | Mitigation                              |
| ------------------------- | ------ | --------------------------------------- |
| Gemini API rate limits    | High   | Implement request queuing + retry logic |
| Image generation failures | Medium | Fallback to stock images or retry       |
| Strapi downtime           | High   | Health checks + error responses         |
| Malformed source URLs     | Low    | URL validation + error handling         |
| Long processing times     | Medium | Set 60s max timeout + user feedback     |

---

## Success Metrics (MVP Launch)

- ⚡ End-to-end flow completes in <60 seconds
- 🎯 90%+ successful publication rate
- 📝 AI-generated content passes readability standards
- 🖼️ Images are contextually relevant
- 🔗 Zero broken links in published articles

---

## Next Steps After MVP

**Not in scope now, but document for future**:

- Content moderation (human review queue)
- Multi-language support
- RSS feed integration
- Scheduled publishing
- Analytics dashboard
- User authentication for admin panel

---

**Bottom Line**: This is a proof-of-concept to validate the AI automation pipeline. Optimize for speed of execution and reliable core functionality. Cut everything that doesn't serve the single flow: URL → AI processing → Publication.
