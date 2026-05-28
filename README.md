Markdown
# StudyDesk — Assignment Tracker & Deadline Manager

StudyDesk is a full-stack web application designed to help students organize, prioritize, and track their academic workloads. Built for **CTE204 Web Development Project II**, this application transitions from volatile client-side state storage to a fully operational, persistent relational storage layer utilizing Node.js, Express, and SQLite.

---

## 📂 Project Architecture

The application implements a structured, modular separation of concerns on the backend (MVC configuration) alongside standard static file hosting for frontend user interface assets:

```text
CTE_204_P2_02240167/
├── public/                 # Static Frontend User Interface Assets
│   ├── app.js              # Client-side validation, UI rendering & API fetch operations
│   ├── index.html          # Markup structures and semantic layout
│   └── style.css           # UI layout adjustments and color theme definitions
├── src/                    # Backend Logical Engine Layer
│   ├── controllers/
│   │   └── assignmentController.js  # SQLite transaction controllers & route handshakes
│   ├── middleware/
│   │   └── errorHandler.js          # Centralized environment exception logging middleware
│   ├── models/
│   │   └── db.js                    # Database binary configuration and schema setups
│   └── routes/
│       └── assignments.js           # API route declarations and mapping matching
├── .env                    # System configuration properties environment values
├── .gitignore              # Dependency execution path exclusion matrices
├── app.js                  # Main Application Entry Point
├── package-lock.json       # Structural dependency configuration log locks
└── package.json            # Node configuration scripts & runtime dependencies manifest
🛠️ Tech Stack & Key Configurations
Frontend Layer
HTML5 & CSS3: Responsive CSS Grid/Flexbox layouts featuring visual indicators mapped cleanly to specific assignment urgency constraints.
Vanilla JavaScript: Non-blocking asynchronous network transactions utilizing the Fetch API to query custom backend endpoints.
Backend Layer
Runtime Environment: Node.js (commonjs system syntax).
Server Framework: Express — configured with native JSON data-parsing parsers and strategic pipeline middleware wrappers.
Database Engine: SQLite via better-sqlite3 execution binaries. Operates locally out of a persistent compiled single-file pipeline architecture (assignments.db).
🚀 Installation & Local Deployment
Follow these sequential steps to establish and execute the repository within local runtime environments:
1. Prerequisites
Ensure you have Node.js installed on your machine.
2. Clone the Repository
Bash
git clone [https://github.com/RigphelTandinWangchuk/CTE_204_P2_02240167.git](https://github.com/RigphelTandinWangchuk/CTE_204_P2_02240167.git)
cd CTE_204_P2_02240167
3. Install Required Dependencies
Execute the entry command below to read the dependency manifests and build your local node_modules dependency binary directory tree:
Bash
npm install
4. Set Up Environment Properties
Create a .env file in the root structural workspace folder directory of your workspace to declare the standard pipeline server listener ports:
Code snippet
PORT=3000
5. Run the Application
Production Execution Mode:
Bash
npm start
Interactive Live-Reload Development Mode (Using Nodemon):
Bash
npm run dev
Once running, navigate your web browser to check the operational client deployment framework directly at:
👉 http://localhost:3000
📡 API Architecture Documentation Specifications
The API accepts and processes full JSON communication parameters structures across these endpoint hooks:
Request Method	Endpoints Matrix Path	Function Description Target
GET	/api/assignments	Fetches a full index log sorted by completion state and due date strings.
POST	/api/assignments	Inserts an assignment record. Requires object keys moduleName, title, dueDate, and priority.
PATCH	/api/assignments/:id/toggle	Inverts the underlying binary completion bit state flag between 0 and 1.
DELETE	/api/assignments/:id	Purges targeted structural indices from your persistent storage database schema completely.
📝 License
Distributed under the ISC License. See package.json configurations details for author properties tracking.