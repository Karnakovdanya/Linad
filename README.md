# LINAD — Language Learning & Tutoring

### An Educational Web Platform for Learning German and English

**LINAD is my personal IT project, which I developed from the initial idea into a functional web application using modern technologies and artificial intelligence.**

The project combines independent language learning, practical real-life situations, interactive exercises, progress tracking, and the possibility of connecting with tutors.

**Project creator, concept and design planning, development coordination:** Danil Karnakov

**Development:** October 2026  
**Status:** Live web application — educational content is still under development.

🌐 **[Explore LINAD — Live Website](https://karnakovdanya.github.io/Linad/#/)**

---

## 1. How the Idea for LINAD Started

The idea for LINAD came from my personal experience of learning foreign languages and adapting to life in Switzerland.

While learning German, I encountered a challenge familiar to many people living abroad: even when you understand grammar and know individual words, using the language confidently in real-life situations can still be difficult.

Speaking with a doctor, attending a job interview, handling official documents, communicating at work, or understanding local dialects requires more than theoretical knowledge. It requires practical preparation.

Language barriers are also often connected to the fear of making mistakes, a lack of confidence, and limited opportunities for meaningful practice.

This inspired me to create a platform that combines structured language learning with preparation for everyday situations.

That is how the concept of **LINAD — Language Learning & Tutoring** was born.

## 2. What Problem Does LINAD Solve?

Traditional approaches to independent language learning do not always make it easy to combine theory, practical exercises, and progress tracking.

Learners often need to switch between different applications, dictionaries, textbooks, and websites.

LINAD is being developed as a unified learning environment where users can:

- Learn German and English.
- Choose between structured learning levels and practical real-life topics.
- Practice vocabulary, useful phrases, and dialogues.
- Test their knowledge through interactive exercises.
- Track their individual learning progress.
- Explore information about language tutors.
- Access the platform from a computer or smartphone.

**The main goal of LINAD is not simply to help people memorize foreign words, but to help them use languages confidently in everyday life.**

## 3. Learning Concept

During the planning stage, I designed two separate learning paths.

### Learning for Real Life

This section is designed for people who need language skills for specific everyday situations, regardless of their current proficiency level.

I defined eight main learning categories:

1. Work and Job Interviews.
2. Doctors and Healthcare.
3. Travel.
4. Documents and Administration.
5. Everyday Communication.
6. Shopping.
7. Housing.
8. Banking and Finance.

For these categories, I also worked on the visual direction, thematic images, and organization of learning materials.

### Learning by Level — A1 to C1

The second learning path focuses on structured language learning according to the Common European Framework of Reference for Languages (CEFR):

**A1 → A2 → B1 → B2 → C1**

I planned a learning structure specifically for LINAD rather than simply copying existing Goethe or telc courses.

The core lesson concept follows this structure:

**Useful Phrases → Dialogue → Flashcards → Practical Exercises → Test → Results**

The planned learning system includes:

- Thematic learning modules.
- Interactive exercises.
- Feedback on correct and incorrect answers.
- Opportunities to repeat exercises.
- Progress and result tracking.
- Flexible navigation between learning materials.

An 80% passing threshold is planned for the final assessment of each module.

### Current Development Status

**The A1–C1 learning materials are still actively being developed and improved.**

The overall educational architecture has been planned around 80 modules and 400 learning topics. As part of the initial implementation, the first German A1 module was developed in greater detail, including five lessons and a final assessment.

The remaining lessons, exercises, and educational materials are being developed, reviewed, and expanded progressively.

LINAD is therefore already accessible as a web application, but its complete educational program is not yet finished.

---

## 4. Design and User Experience

One of my main goals was to create a platform that is not only functional but also visually appealing, intuitive, and accessible.

I personally defined the interface concept and made decisions about the design throughout the development process.

### What I Planned

- Overall website structure and page organization.
- Navigation and user flows.
- Homepage layout and composition.
- LINAD brand identity and visual direction.
- Logo concept and visual branding.
- Color palette.
- Light and dark themes.
- Learning category cards.
- User profiles and personal dashboard layouts.
- Responsive design for desktop and mobile devices.

I also paid particular attention to visual content.

For the homepage and learning sections, I developed a visual direction focused on realistic photography, natural lighting, believable materials, and an authentic atmosphere of independent learning.

My goal was to create an experience that feels like a modern educational product rather than a collection of unrelated technical pages.

### Multilingual Interface

LINAD supports three interface languages:

- English.
- German.
- Russian.

The languages offered for learning are German and English.

---

## 5. LINAD Interactive Assistant

During development, I introduced the idea of an interactive assistant called **Lin**.

Its purpose is to help new users navigate the platform and find the information or learning sections they need.

I defined the main principles of its functionality:

- A floating assistant button within the interface.
- Predefined questions and answers.
- Navigation to relevant pages.
- Support for multiple interface languages.
- Responsive behavior on mobile devices.

The assistant uses predefined interaction scenarios and JavaScript rather than a separate paid generative AI API.

This approach made it possible to create a useful navigation feature without additional AI service costs.

## 6. Tutors and Telegram Integration

From the beginning, I envisioned LINAD not only as a self-learning platform but also as a space connecting learners and language tutors.

For this purpose, I planned the **Tutors** section.

The initial version includes:

- A tutor directory.
- Individual tutor profiles.
- Information about available tutors.
- Contact and inquiry options.
- Ways for users to express interest in lessons.

The initial implementation uses demonstration tutor profiles.

A complete booking system, online payments, and a larger tutor network are potential areas for future development.

### Telegram as Part of the Ecosystem

I also created a Telegram channel and bot connected to my language-learning concept.

Telegram is intended to serve as an additional communication channel for educational content, community development, and engagement around LINAD.

The platform includes relevant links and informational sections.

**Web3Forms** is used to process contact inquiries and form submissions.

---

## 7. User Accounts and Supabase

Another important development stage was the implementation of user accounts.

I wanted LINAD to evolve from a basic informational website into a web application capable of managing personalized user information.

For this purpose, I selected **Supabase**.

### Technical Foundation

The application includes:

- User registration and authentication.
- Personal user profiles.
- Learning progress storage.
- Data structures for learning results.
- Profile image storage.
- Learning goal settings.
- An administrative section.

I participated in configuring Supabase, executing SQL queries, and connecting the required components step by step.

During development, database migrations were applied for seven core tables related to user accounts and learning progress, along with additional changes supporting profiles, avatars, and learning goals.

### Data Security — Row Level Security

A separate stage involved configuring **Row Level Security (RLS)** in Supabase.

RLS is a PostgreSQL security mechanism that controls access to individual database rows.

Its purpose within LINAD is to restrict access to user information according to defined security policies.

To support this, SQL migrations were applied and access policies were configured.

Administrative access was also prepared, and an `/admin` section was implemented.

**Important:** Configuring security mechanisms does not replace comprehensive testing of registration, access permissions, and cross-device data synchronization. These remain part of the project's ongoing development and quality assurance.

---

## 8. How I Developed LINAD Using Artificial Intelligence

LINAD is an example of a project developed through **AI-assisted development**, also commonly referred to as *Vibe Coding*.

For technical implementation, I used **OpenAI Codex**. I also used ChatGPT for discussing ideas, preparing requirements, and planning development stages.

I do not present this project as an application whose entire source code I wrote manually.

My role was to guide and coordinate the development process, from the original idea to the working product.

### My Development Process

**Stage 1 — Identifying the Problem**

I defined the target audience, analyzed common difficulties in learning foreign languages, and identified the main problems the platform should address.

**Stage 2 — Product Concept**

I developed the project concept, selected its name, defined the brand direction, planned the educational model, and determined the core functionality.

**Stage 3 — Interface Planning**

I planned the website structure, navigation, visual identity, themes, learning cards, and user interactions.

**Stage 4 — Requirements and Task Definition**

I translated my ideas into specific development instructions, describing how features should behave, what should happen after user interactions, and what results I expected.

**Stage 5 — AI-Assisted Implementation**

Based on these requirements, OpenAI Codex generated and modified the application's source code.

**Stage 6 — Testing and Iteration**

I reviewed the application, tested functionality, identified problems, refined requirements, and requested improvements.

**Stage 7 — External Services and Backend Configuration**

I participated in configuring Supabase, database structures, SQL migrations, authentication, contact forms, and administrative functionality.

**Stage 8 — Deployment**

I prepared the GitHub repository and configured the application's deployment through GitHub Pages.

This process allowed me to experience the main stages of digital product development, from identifying a problem to implementation, testing, and deployment.

---

## 9. Technologies Used

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| TypeScript | Application development with static type checking |
| Vite | Development tooling and production builds |
| React Router | Navigation between application sections |
| Supabase | Authentication, database, and data storage |
| PostgreSQL / SQL | Database structure, queries, and access policies |
| Row Level Security | Database access control |
| Web3Forms | Contact and inquiry form processing |
| JavaScript | Interactive functionality |
| Git / GitHub | Version control and source code management |
| GitHub Actions | Automated builds, testing, and deployment |
| GitHub Pages | Web application hosting |
| Playwright | Automated browser testing |
| OpenAI Codex | AI-assisted code generation and development |

## 10. Testing and Quality Assurance

During development, I encountered practical challenges related to testing and maintaining a web application.

Automated checks were configured for LINAD to cover different user scenarios.

These included:

- Navigation between pages.
- Responsive behavior across devices.
- Interface language switching.
- Light and dark themes.
- Learning exercises.
- Speech and pronunciation features.
- Error handling.
- Production builds.

During preparation for GitHub Pages deployment, a complete automated test run was executed, with **458 out of 458 tests passing**.

This stage helped me gain practical exposure to automated testing, debugging, and continuous integration.

## 11. Current Status and Future Development

**LINAD is an ongoing project, not a fully completed commercial product.**

The web application has been published and is available for exploration.

The main priorities for further development include:

- Completing German learning materials for levels A1–C1.
- Developing and expanding the English learning program.
- Adding more practical exercises and dialogues.
- Improving the overall user experience.
- Further testing registration and progress synchronization.
- Expanding the tutor directory.
- Continuing to improve the mobile experience.
- Developing additional personalized learning features.

I see LINAD as a long-term project that can be continuously improved, expanded, and refined.

---

## 12. Why I Created This Project

LINAD became more than an opportunity to develop an educational platform. It was also my introduction to the practical process of building software.

Before starting this project, I did not have formal professional training in programming.

However, I wanted to understand how modern web applications are created, how user interfaces and databases work, and how authentication, testing, and deployment fit together.

Using artificial intelligence allowed me to begin implementing my own idea and gain practical experience with modern development tools.

At the same time, I understand the difference between coordinating AI-assisted development and independently writing production-quality software.

For this reason, I see LINAD as the beginning of my journey into IT, rather than proof that I have already reached the level of an experienced software developer.

**My goal is to pursue a professional apprenticeship as an Informatiker EFZ, specializing in Application Development (Applikationsentwicklung), strengthen my technical foundations, and learn to develop reliable software independently.**

LINAD demonstrates my initiative, ability to plan and coordinate a project, willingness to learn new technologies, approach to solving technical problems, and determination to turn an idea into a practical result.

---

### Project Creator

**Danil Karnakov**

Product Idea · Concept Development · UI/UX Planning · Development Coordination · AI-Assisted Development · Testing · Deployment

**[Explore LINAD — Live Website](https://karnakovdanya.github.io/Linad/#/)**

*LINAD — transforming personal language-learning experiences into a digital educational product.*
