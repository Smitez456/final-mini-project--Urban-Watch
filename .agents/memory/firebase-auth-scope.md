---
name: UrbanWatch service scope
description: Defines UrbanWatch persistence, image storage, GPS/map, and AI boundaries.
---

Use Firebase for Email/Password Authentication, the authenticated user's profile identity, and Cloud Firestore complaint persistence. Use Cloudinary through the API server for complaint images; never expose its API secret to the browser. GPS is optional, starts only after an explicit user click, and uses no-key OpenStreetMap views; manual locations must remain available. Image classification uses the Replit-managed OpenAI integration from the API server only and returns a validated suggestion from the fixed civic-category list.

**Why:** The user explicitly chose Cloudinary instead of Firebase Storage, privacy-conscious GPS/maps without paid keys, and real server-side vision analysis with no browser-visible AI credentials.

**How to apply:** Upload first, classify the validated Cloudinary image through the authenticated API, let the citizen confirm/change the suggestion, then save the final issueType. Never auto-track location or expose secrets.