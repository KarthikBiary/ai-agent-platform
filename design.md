## **AI Agent Platform - Product & System Design** 

Version: 1.0 

Status: V1 MVP 

## **Vision** 

Build an open-source AI Agent Platform that allows businesses to create, manage, train, deploy, and monitor AI agents. 

The platform should support: 

- Voice Agents 

- Chat Agents 

- Lead Qualification 

- Appointment Booking 

- Knowledge Bases 

- Call Analytics 

- Multi-Industry Templates 

Target customers: 

- Healthcare 

- Real Estate 

- Restaurants 

- Spas 

- Convention Halls 

- Hospitality Businesses 

Primary goal: 

Allow a business owner to create an AI agent in under 10 minutes. 

## **Product Principles** 

1. Simplicity First 

2. Mobile Responsive 

3. Enterprise Ready 

4. Self Hosted Friendly 

5. Open Source 

6. Fast User Experience 

7. AI Native Workflows 

1 

## **V1 Scope** 

Included: 

- Dashboard 

- Agent Management 

- Knowledge Base 

- Lead Management 

- Call Logs 

- Analytics 

- Landing Pages 

Excluded: 

- Billing 

- Marketplace 

- Team Permissions 

- Multi-Tenant Isolation 

- Voice Calling Engine 

These will be V2. 

## **User Journey** 

## **Agent Creation** 

User logs in → Creates Agent → Adds Prompt → Selects Industry → Selects Voice → Saves Agent 

## **Knowledge Upload** 

User opens Agent 

Uploads: 

- PDF • DOCX 

- Website URL 

System: 

- Stores source 

- Extracts content 

- Chunks content 

- Creates embeddings 

- Stores vectors 

2 

## **Lead Management** 

Lead enters system 

Source: 

- Call 

- Form • WhatsApp • Chat 

Lead appears in dashboard 

User can: 

- View 

- Search • Filter 

- Update status 

## **Application Structure** 

/app 

/dashboard /agents /leads /calls /knowledge /analytics /settings 

## **Dashboard Page** 

Purpose: 

Provide business overview. 

Cards: 

- Total Agents 

- Total Leads 

- Total Calls 

- Knowledge Sources 

Charts: 

- Leads Last 30 Days 

- Calls Last 30 Days 

- Conversions 

3 

Recent Activity: 

- New Leads 

- New Calls 

- New Uploads 

## **Agents Page** 

Purpose: 

Manage AI agents. 

Features: 

- Create Agent 

- Edit Agent 

- Delete Agent 

- Duplicate Agent 

Fields: 

Name Industry Prompt Voice 

Table Columns: 

Name Industry Voice Created Status 

## **Knowledge Base Page** 

Purpose: 

Manage agent knowledge. 

Supported Sources: 

- PDF 

- DOCX 

- URL 

Future: 

- Notion 

- Google Docs • Confluence 

Table: 

4 

File Name Type Status Uploaded Date 

Actions: 

- View 

- Delete 

- Reprocess 

## **Leads Page** 

Purpose: 

Manage incoming leads. 

Lead Fields: 

Name Phone Email Status Score Assigned Agent 

Statuses: 

New Contacted Qualified Booked Lost 

Features: 

Search Filter Sort Bulk Update 

## **Calls Page** 

Purpose: 

Review conversations. 

Fields: 

Call ID Agent Lead Duration Date 

Expandable View: 

Transcript Summary Recording 

## **Analytics Page** 

Purpose: 

5 

Measure business performance. 

Metrics: 

Total Calls Total Leads Bookings Conversion Rate 

Charts: 

Daily Calls Daily Leads Weekly Conversions 

## **Design System** 

Theme: 

Professional SaaS 

Inspired By: 

- OpenAI 

- Linear 

- Vercel 

- Retell 

Rules: 

8px spacing system 

Rounded corners 

Minimal shadows 

Consistent typography 

Dark mode support 

## **Database Design** 

## **agents** 

id name industry prompt voice status created_at 

## **leads** 

id name phone email status score agent_id created_at 

6 

## **knowledge_sources** 

id agent_id file_name source_type status created_at 

## **calls** 

id agent_id lead_id duration recording_url transcript summary created_at 

## **API Design** 

GET /api/agents 

POST /api/agents 

PUT /api/agents/:id 

DELETE /api/agents/:id 

GET /api/leads 

POST /api/leads 

GET /api/calls 

GET /api/knowledge 

POST /api/upload 

## **Frontend Standards** 

Use: 

- Server Components by default • Client Components only when needed 

Use: 

- shadcn/ui 

- TailwindCSS 

Never: 

- Duplicate components 

7 

• Hardcode data structures 

Always: 

• Create reusable UI 

## **Folder Structure** 

app/ 

components/ 

components/layout 

components/dashboard 

components/agents 

components/leads 

components/calls 

components/knowledge 

components/analytics 

lib/ 

prisma/ 

types/ 

## **Week 1 Deliverables** 

Dashboard 

Agent CRUD 

Knowledge Upload UI 

Lead Dashboard 

Responsive Layout 

Sidebar Navigation 

8 

## **Week 2 Deliverables** 

Bookings 

Analytics 

Call Logs 

Search 

Filters 

## **Week 3 Deliverables** 

Healthcare Landing Page 

Real Estate Landing Page 

F&B Landing Page 

Spa Landing Page 

## **Definition of Done** 

Feature is considered complete when: 

- Responsive 

- Type Safe 

- Tested 

- Error Handled 

- Accessible 

- Production Ready 

- Reviewed by Founder 

9 

