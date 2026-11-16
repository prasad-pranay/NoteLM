<div align="center">
  <table>
    <tr>
      <td align="center" width="120">
        <img src="public/icon.png" width="120" height="120" />
      </td>
      <td>
        <h1>NoteLM</h1>
        <p>
          Frontend Setup
        </p>
      </td>
    </tr>
  </table>
</div>


## Table of Contents

- [Tech Stack](#tech-stack)
- [Frontend Setup](#frontend-setup)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Installation & Running](#installation--running)

## Tech Stack

| Category | Technologies |
|---|---|
| **Core** | React 19, TypeScript 7 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **State Management** | Zustand |
| **Server State & Data Fetching** | TanStack Query, Axios |
| **Routing** | React Router |
| **Real-time Communication** | Socket.IO Client |
| **Animations & Interactions** | Framer Motion, GSAP, Lenis |
| **UI & Icons** | Lucide React, React Icons, React Resizable Panels |
| **File Handling** | React Dropzone |
| **Markdown & Math Rendering** | React Markdown, KaTeX, Remark Math, Rehype KaTeX |
| **Charts & Visualization** | Recharts, React Flow, Three.js |
| **PDF Generation** | jsPDF, html2canvas |
| **Notifications** | React Hot Toast |

## Frontend Setup

### Prerequisites
- Node.js (v18 or later)
- npm

### Environment Setup

Create a `.env` file in the `frontend` directory and configure the following variable:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Replace the URL with the address where your backend server is running. For backend configuration and setup instructions, see the [Backend Setup Guide](../backend/README.md).

### Installation & Running

1. Clone the repository (if you haven't already):

   ```bash
   git clone https://github.com/prasad-pranay/notelm.git
   ```

2. Navigate to the frontend directory:

   ```bash
   cd notelm/frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the application in your browser:

   **http://localhost:5173**




<br/>
<br/>

---
### 🎉 Ta-da! Frontend Setup Complete!

For any queries or issues, feel free to contact me at [prasadpranay2005@gmail.com](mailto:prasadpranay2005@gmail.com).