# IELTS Task 1 Mentor

An AI-powered application to help students practice and grade their IELTS Writing Task 1 essays using Gemini AI.

## Features

- **AI Grading**: Instant scoring and feedback on Task Response, Coherence, Lexical Resource, and Grammatical Range.
- **Chart Upload**: Upload images of charts/graphs for context-aware grading.
- **Dashboard**: Track your progress and review past essay scores.
- **Responsive Design**: Works on desktop and mobile.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: SQLite (via Prisma)
- **AI Model**: Google Gemini 1.5/2.5 Flash
- **Styling**: Tailwind CSS

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd ielts-task1-master
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment**:
    Create a `.env.local` file with your API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    DATABASE_URL=file:./dev.db
    ```

4.  **Initialize Database**:
    ```bash
    npx prisma db push
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to start practicing!
