# UrbanWatch Presentation Script

## Slides 2–14 | Preliminary Presentation

**Project:** UrbanWatch — Smart Citizen Assistant  
**Project Guide:** Mrs. Gracemol Thankachan  
**Presented by:** Mark Sumesh Paul, Patrick John Paul, and Steve Sumesh Paul  
**Department:** CU  
**Presentation date:** 03 September 2026

---

## How to use this script

This script is written as a natural speaking guide rather than something that must be
read word for word. Each section is designed for approximately 45–75 seconds. The
speaker assignments give all three members a substantial part of the presentation and
follow the responsibilities shown on Slide 12.

### Speaker allocation

| Slides | Speaker | Main responsibility |
|---|---|---|
| 2, 4, 10, 13, 14 | Mark Sumesh Paul | User experience, frontend workflow, architecture overview, documentation, and presentation |
| 3, 8, 9, 12 | Patrick John Paul | Problem framing, Firebase/Firestore context, and literature survey |
| 5, 6, 7, 11, 12 | Steve Sumesh Paul | Backend, Cloudinary, validation, testing, risks, resources, and algorithms |

### Important presentation note

UrbanWatch currently demonstrates the web reporting workflow, Firebase
Email/Password authentication, Firestore complaint persistence, authenticated image
upload, Cloudinary image storage, and administrator complaint views. GPS assistance,
AI issue detection, municipal integrations, and production-scale moderation are
planned or exploratory features. These should be described as future work, not as
completed functionality.

---

# Slide 2 — Motivation

**Speaker: Mark Sumesh Paul**

“Good morning everyone. Civic problems such as potholes, waste accumulation, broken
streetlights, and damaged public spaces often become visible before they enter any
formal reporting system. The motivation for UrbanWatch is to make that first reporting
step more structured and useful.

Instead of citizens using disconnected channels, UrbanWatch proposes one web-based
workflow for reporting an issue. A citizen can provide a clear description, attach
visual evidence, and include the information needed for review. After submission, the
citizen should also be able to understand the status of the complaint.

From the municipal side, the same information can be viewed through an administrator
queue. This creates a connection between the citizen report and the team responsible
for reviewing it. Our goal is not simply to collect more complaints. Our goal is to
improve the quality of the information received and make the process easier to
follow.”

**Handoff to Patrick:**  
“Patrick will now explain the specific problem that UrbanWatch is designed to address.”

---

# Slide 3 — Problem Statement

**Speaker: Patrick John Paul**

“The problem can be understood through three main weaknesses in the existing reporting
process.

First, there is fragmented intake. Reports may arrive through different channels, and
the information supplied by citizens may not be consistent. Important details can be
missing or difficult to compare.

Second, there is weak traceability. After reporting an issue, a citizen may not know
whether the complaint was received, assigned, or resolved. This reduces confidence in
the process.

Third, there is manual triage. When descriptions are unstructured, deciding the
category and urgency of an issue takes more time and depends heavily on manual review.

UrbanWatch investigates whether a single web workflow can improve report quality,
evidence handling, and status visibility for both citizens and municipal teams. This
problem statement guides the objectives and the system design shown in the next
slides.”

**Handoff to Mark:**  
“Mark will now present the goals and objectives that translate this problem into a
working academic prototype.”

---

# Slide 4 — Goals and Objectives

**Speaker: Mark Sumesh Paul**

“The primary goal of UrbanWatch is to build a usable academic prototype that connects
citizen reporting with administrator review.

The first objective is to provide Firebase Email/Password authentication, so that
users have a clear sign-in and registration flow. The second is to save complaint
records in Firestore so that reports are not lost after the page is refreshed.

The third objective is to handle image evidence securely through the backend and
Cloudinary. The fourth is to provide status tracking so that a complaint can move
through stages such as submitted, in review, assigned, and resolved.

The fifth objective is an administrator queue or overview where reports can be
reviewed. GPS-assisted location and AI assistance are shown as planned objectives for
future development. They are part of the academic direction of the project, but they
are not presented as completed features in this prototype.”

**Handoff to Steve:**  
“Steve will now explain the assumptions and risks we considered while designing this
workflow.”

---

# Slide 5 — Assumptions and Risks

**Speaker: Steve Sumesh Paul**

“Every software system depends on certain assumptions. For UrbanWatch, we assume that
citizens have internet and camera access, that municipal staff can share a review
queue, and that the locations and descriptions supplied by users are reasonably
accurate. We also treat this as a limited academic evaluation rather than a
production-scale deployment.

There are several risks. False or duplicate reports can reduce the usefulness of the
queue, so future moderation and duplicate detection are possible controls. Sensitive
images create a privacy concern, which is why file validation and access rules are
important. AI suggestions could also be wrong, so human review must remain
authoritative.

Finally, UrbanWatch depends on external services such as Firebase and Cloudinary.
Service availability is therefore an acknowledged dependency. These controls and
limitations help us explain what the prototype can demonstrate safely and what still
needs further evaluation.”

---

# Slide 6 — Project Scope and Target Group

**Speaker: Steve Sumesh Paul**

“The implemented scope includes user registration and login, a complaint form with
image upload, Firestore record creation, citizen tracking views, and administrator
views.

There is also a clear boundary around the project. GPS-assisted location, AI category
suggestions, direct municipal integrations, and production-scale moderation are
planned or limited areas. They are not required to claim that the current academic
prototype is complete.

The primary target group is residents who need to report civic issues. Secondary users
include municipal reviewers, ward officers, and public-works teams who need to inspect
the submitted information and update its progress.

By defining both the included and planned parts, the project remains realistic. It
shows a complete core workflow while leaving room for future features such as
automated location assistance and intelligent classification.”

**Handoff to Steve:**  
“The next slide lists the technical and practical resources required to support this
scope.”

---

# Slide 7 — Resources Needed

**Speaker: Steve Sumesh Paul**

“UrbanWatch uses four main groups of resources.

The frontend uses React, TypeScript, Vite, and Tailwind CSS to create the reporting
interface, responsive layouts, and administrator views. Firebase provides the
Email/Password authentication and Firestore data services.

The backend uses Node.js and Express. Its main responsibility in this workflow is to
provide an authenticated upload route that validates the request before sending image
evidence to Cloudinary. Cloudinary is used for secure HTTPS image storage and delivery.

In addition to software services, the project needs laptops, modern web browsers,
internet access, and suitable test image data. These resources are enough to
demonstrate the core reporting workflow without requiring a separate native mobile
application or a full municipal deployment.”

**Handoff to Patrick:**  
“Patrick will now explain the research literature that informed our citizen-centered
and road-issue reporting direction.”

---

# Slide 8 — Literature Survey I

**Speaker: Patrick John Paul**

“This slide compares five papers related to smart-city governance, citizen
participation, digital inclusion, and the use of AI in smart cities.

The first paper emphasizes active citizen engagement in smart-city governance. The
second highlights digital inequalities and the challenge of including people who may
have limited access or digital skills. The third presents citizen-centered
participation through European case studies. The fourth reviews applications,
barriers, and future directions for AI in smart cities. The fifth focuses on digital
inclusion and social cohesion, with attention to barriers such as infrastructure,
affordability, and digital literacy.

Together, these papers support an important design principle: a smart-city system
should be citizen-centered and inclusive, not technology-centered alone. They also
show limitations. Some evidence is context-dependent, some studies have limited
geographic scope, and several are policy or literature studies rather than deployed
reporting applications.

UrbanWatch uses these findings as research motivation. The literature informs the
design direction, but it does not by itself prove that our prototype is effective.”

---

# Slide 9 — Literature Survey II

**Speaker: Patrick John Paul**

“The second literature survey focuses on automated pothole and road-defect detection.
These studies demonstrate how computer vision and deep-learning methods can identify
road damage from images or video.

The papers compare approaches such as YOLOv8 with CNN models, transfer learning,
YOLO-based dimension estimation, deformable convolution, and edge-ready deep-learning
models. Reported advantages include real-time localization, detection of size and
location, better handling of irregular shapes, and the possibility of deployment on
edge devices.

However, the limitations are equally important. Models may need varied and
representative training images. Some studies do not use a new field dataset. Certain
approaches depend on vehicle-mounted cameras, require more model complexity, or are
limited by older datasets and hardware.

UrbanWatch does not claim to have implemented these AI models yet. The survey
supports our planned direction for future image-based issue detection while the
current prototype focuses on secure reporting, evidence storage, and human review.”

**Handoff to Mark:**  
“Mark will now explain how the UrbanWatch components connect in the system
architecture.”

---

# Slide 10 — Architecture / Block Diagram

**Speaker: Mark Sumesh Paul**

“This block diagram shows the main flow through UrbanWatch.

The user begins in a browser or mobile web browser and interacts with the React
application. The application supports reporting an issue and tracking its status.
Firebase provides authentication and Firestore provides complaint data persistence.
The administrator view reads the relevant complaint data and supports queue and
status management.

Image evidence follows a protected secondary path. The frontend sends the image
request to the Express upload API together with the Firebase authentication token.
The backend validates the token and checks the uploaded file before sending it to
Cloudinary. Cloudinary returns an HTTPS image URL, and that URL is then associated
with the complaint record.

This separation gives each layer a clear responsibility: the frontend handles the
user experience, Firebase handles identity and records, the backend protects the
upload path, and Cloudinary handles image storage.”

**Handoff to Steve:**  
“Steve will add the validation and workflow logic that keeps this architecture
controlled.”

**Steve’s short addition:**  
“On the upload path, the backend checks the Firebase session, accepted MIME types,
file signatures, and the size limit before forwarding an image. Complaints are saved
only after a successful authenticated upload, which avoids storing a report that
refers to missing evidence.”

---

# Slide 11 — Algorithms Used

**Speaker: Steve Sumesh Paul**

“The current prototype uses workflow and validation logic rather than claiming a
finished AI model.

First, an authentication gate checks whether a Firebase session is available before
protected reporting actions can continue. Second, the upload validation pipeline
checks the file type, file signature, size limit, and HTTPS response path. Third,
complaint retrieval is filtered so that citizens can view their own reports while
administrators can view the review queue.

The complaint status flow groups records into stages such as Submitted, In Review,
Assigned, and Resolved. This makes the progress understandable to both citizens and
reviewers.

The slide also shows planned AI assistance. Possible future methods include
transfer-learning CNN or YOLO image classification, keyword or semantic text
suggestions, and priority scoring based on issue type, safety, and duplicate signals.
These would remain suggestions. Human review must remain the final authority,
especially when an automated model is uncertain.”

**Handoff to Patrick:**  
“Patrick will introduce the team responsibilities and how each member contributed to
the project.”

---

# Slide 12 — Roles Assigned

**Speaker: Patrick John Paul**

“This slide shows the three-member responsibility structure for UrbanWatch. The roles
are divided by technical ownership, but the work remains collaborative.

Mark Sumesh Paul is responsible for the frontend UI, accessibility, responsive
layouts, documentation, and presentation. Patrick John Paul is responsible for
Firebase authentication, the Firestore data model, and the literature survey. Steve
Sumesh Paul is responsible for the backend API, Cloudinary upload, security
validation, and testing.”

### Individual confirmations

**Mark Sumesh Paul:**  
“My focus is making the reporting and review experience clear and responsive. I also
coordinate the documentation and presentation of the project.”

**Patrick John Paul:**  
“My focus is the Firebase and Firestore data flow, along with the research literature
that supports the citizen-centered design.”

**Steve Sumesh Paul:**  
“My focus is the backend upload route, Cloudinary integration, security checks, and
testing the workflow.”

**Handoff to Mark:**  
“Mark will now explain the schedule and how the work is planned across the project
phases.”

---

# Slide 13 — Project Timeline

**Speaker: Mark Sumesh Paul**

“The timeline is organized into five phases.

Research takes place in August 2026 and includes problem framing and the literature
survey. Core build is also scheduled for August 2026, covering authentication,
complaint reporting, and Firestore persistence.

Integration is planned for September 2026. This phase includes Cloudinary and the
administrator queue. Validation is scheduled for October 2026 and includes testing
and AI exploration. Finally, delivery is also scheduled for October 2026 and includes
evaluation and the final report.

The repeated months indicate overlapping academic phases rather than separate
calendar years. The phrase AI exploration in the validation phase means that we study
the possibility of future AI assistance. It does not mean that a complete AI model is
already part of the current prototype.”

---

# Slide 14 — Conclusion

**Speaker: Mark Sumesh Paul**

“To conclude, UrbanWatch connects credible citizen evidence to a more traceable
municipal workflow.

The current prototype supports Firebase sign-in, Firestore complaint records, secure
image routing through the backend, and Cloudinary image storage. It also provides the
core views needed for citizens and administrators to understand the reporting
process.

The project has deliberately separated completed work from future academic work.
GPS assistance, AI issue detection, municipal integrations, and larger-scale
moderation remain future directions. This keeps our current claims accurate while
giving the project a clear path for extension.

Our next evaluation focus is usability, report quality, and workflow clarity. We want
to determine whether citizens can submit useful evidence easily and whether reviewers
can understand and act on that information efficiently.

Thank you. We are ready to answer your questions.”

---

## Quick handoff reference

| Slide | Main speaker | Topic |
|---:|---|---|
| 2 | Mark | Motivation |
| 3 | Patrick | Problem statement |
| 4 | Mark | Goals and objectives |
| 5 | Steve | Assumptions and risks |
| 6 | Steve | Scope and target group |
| 7 | Steve | Resources needed |
| 8 | Patrick | Literature Survey I |
| 9 | Patrick | Literature Survey II |
| 10 | Mark + Steve | Architecture and upload validation |
| 11 | Steve | Algorithms and planned AI |
| 12 | Patrick + all members | Roles assigned |
| 13 | Mark | Timeline |
| 14 | Mark | Conclusion |

## Presentation reminders

- Say **“implemented”** for authentication, Firestore persistence, the protected
  upload route, Cloudinary storage, status views, and administrator views.
- Say **“planned,” “proposed,” or “future work”** for GPS assistance, AI detection,
  municipal integrations, and production-scale moderation.
- On the literature slides, explain what the papers contribute and what their
  limitations are; do not say that the papers validate UrbanWatch directly.
- On the architecture slide, emphasize the authenticated backend upload path and the
  separation between Firebase records and Cloudinary image storage.
- Keep the handoffs short so the presentation feels like one team presentation.