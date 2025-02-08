# Change Log for SiteWhisper

This file tracks all changes made to the project, including the time the changes were made, affected files, the reasons behind the changes, and detailed explanations for AI developers regarding code integrity.

---

## [1.2.0] - 2024-03-XX
**Files Updated:**
- `app/admin/gods-eye-view/page.tsx`: Added new Admin Gods-Eye-View dashboard feature.
- `CHANGELOG.md`: Updated changelog to include "Admin gods-eye-view" feature.
- `CURSOR_PROMPT.md`: Updated to include reference to the Admin dashboard context.

**Changes:**
- **Admin Gods-Eye-View Feature:**  
  Introduced a comprehensive admin dashboard showcasing metrics including token usages, Whisper memory block creation, billing details, user signups, database status, crawler status, and error logs.
- **Role-Based Access Control:**  
  Implemented role-based access where the admin (currently `steven@bulawebs.com`) and users with a "view-only" role (`admin_view`) can access this page.
- **Dashboard Enhancements & Future Improvements:**  
  Proposed additional features such as real-time data updates, graphical charts for analytics, advanced filtering, CSV export functionality, notifications for system alerts, and audit logs.

**Reason:**
- To provide administrators with a comprehensive, real-time overview of system metrics for performance monitoring and troubleshooting.
- To enable future enhancements through advanced analytics and reporting, while maintaining tight role-based access control.

**Notes:**
- Further improvements may include integrating interactive charting components and expanding audit log functionalities.

---

## [1.1.0] - 2024-03-15
**Files Updated:**
- `ai-service.ts`: Renamed from `openrouter.ts`. Added support for multiple AI models (DeepSeek, Anthropic Claude, Mistral).
- `sitewhisper-identity.ts`: Updated the identity system with version control, a changelog section, and an enhanced system prompt.
- `routes.ts`: Centralized route management and public identity definition.

**Changes:**
- **Multi-Model AI Support:**  
  Added the capability to use multiple AI models via `ai-service.ts`, allowing selection between DeepSeek, Anthropic's Claude, and Mistral.
  
- **Version Control & Changelog Integration:**  
  Enhanced `sitewhisper-identity.ts` by introducing version control and a structured changelog to help track all updates and guide developers.
  
- **Routing & Public Identity:**  
  Created `routes.ts` to consolidate and manage all application routes, ensuring that public and authenticated routes are defined and accessible.

- **Documentation & AI Integration:**  
  Updated system prompts and identity access, so that public versus full technical details become available based on access level.

**Reason:**
- To improve multi-model support and maintain transparency through version control. These changes ensure consistent route management, prompt configurations, and assist developers in maintaining code integrity.

**Notes:**
- Ensure that environment variables for all AI models are configured correctly.
- Confirm that caching (via Redis) and Supabase RLS policies are updated in accordance with these changes.

---

## [1.0.0] - 2024-03-01
**Files Created:**
- `sitewhisper-identity.ts`: Initial release containing the SiteWhisper AI identity, core capabilities, and communication style.
- `openrouter.ts` (renamed later to `ai-service.ts`): Original AI service integration using DeepSeek API.
- `routes.ts`: Basic route definitions for public and authenticated pages.

**Changes:**
- Established the core identity and functionality of SiteWhisper.
- Laid the foundation for a token-based model and AI-powered website analysis.

---

*Remember to update this file with every change to maintain a complete record of the project history.* 