# BetterMe

BetterMe is an AI-powered personal coaching and self-improvement platform designed to help you track habits, solve problems, and achieve personal growth through actionable insights and a dedicated AI assistant.

## Features

- 🧠 **AI Coach**: Chat with an intelligent, context-aware AI coach powered by OpenAI.
- 📊 **Insight Dashboard**: Visualize your progress and habits using intuitive charts.
- 🔥 **Consistency Heatmap**: Track your daily streaks and build lasting routines.
- 📝 **Log Entries**: Record your daily progress, thoughts, and reflections.
- 🔐 **Authentication**: Secure user authentication and data management via Supabase.
- ✨ **Modern UI**: Built with Next.js 16, Tailwind CSS, shadcn/ui, and Framer Motion for a stunning, responsive user experience.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **UI Components**: shadcn/ui, Lucide React
- **Database & Auth**: Supabase
- **AI Integration**: Vercel AI SDK & OpenAI
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- A Supabase account and project
- An OpenAI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd betterme
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the MIT License.
