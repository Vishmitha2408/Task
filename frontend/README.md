# Project Title

## Overview
Brief description of what your project does.

## Features
- Admin can manage agents, subagents, and upload/distribute CSV leads.
- Agents can manage subagents and view their assigned lists.
- Subagents can only view their assigned tasks.
- Secure login and role-based access.

## Technologies Used
- Frontend: React, Material-UI
- Backend: Node.js, Express, MongoDB, Mongoose

## Setup Instructions

### Backend
1. `cd backend`
2. Run `npm install`
3. Configure your `.env` file (MongoDB URI, etc.)
4. Run `npm start`

### Frontend
1. `cd frontend`
2. Run `npm install`
3. Run `npm start`

## Usage
- Admin: Full access to dashboard, agent/subagent management, CSV upload.
- Agent: Manage/view subagents and receive distributed leads.
- Subagent: View assigned tasks only.

## Notes
- CSV/XLSX upload must have columns: `FirstName`, `Phone`, `Notes`.
- Subagents cannot add/edit/delete tasks, only view.

## License
[MIT](LICENSE)