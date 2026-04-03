# Taskit - Task Management System

A web platform to manage tasks, built with **Next.js (App Router)**, **Tailwind v4**, and **Supabase**.
Features a beautiful Jira/Trello-style Kanban dashboard with a dynamic Glassmorphism interface and a dedicated Dark Mode.

## Features

- **Direct Authentication**: Register and Login securely, managed in a custom `public.users` table instead of relying entirely on 3rd-party wrappers, fulfilling the secure, simple custom security challenge.
- **Nested Subtasks**: Create n-level deep subtasks inside tasks.
- **Effort Estimates**: Computes total combined efforts in real-time bubbling up from leaf subtasks to the top-level parent task.
- **Kanban Board**: Drag and drop tasks flexibly between "To Do", "In Progress", and "Done" using `@hello-pangea/dnd`.

## Database Setup

To use this application, you must configure a Supabase Postgres instance.
We expect the following tables inside your **`public`** schema:

### `users` table
- `id` (UUID, Primary Key, default `uuid_generate_v4()`)
- `name` (text, not null)
- `email` (text, unique, not null)
- `password_hash` (text, not null)
- `created_at` (timestampz)

### `tasks` table
- `id` (UUID, Primary Key, default `uuid_generate_v4()`)
- `user_id` (UUID, Foreign Key to `users(id)`, not null)
- `title` (text, not null)
- `description` (text)
- `status` (text: 'TODO', 'IN_PROGRESS', 'DONE', default 'TODO')
- `priority` (text: 'LOW', 'MEDIUM', 'HIGH', 'URGENT', default 'MEDIUM')
- `effort_estimate` (integer, default 0)
- `parent_task_id` (UUID, Foreign Key to `tasks(id)`, nullable)
- `created_at` (timestampz)

## Environment Variables

Create a `.env.local` in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the app

First, install dependencies:
```bash
npm install
```

Then start the Next.js development server:
```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

## Running Unit Tests

The business logic for calculating subtask effort aggregation is tested via Vitest.
To run the automated tests:
```bash
npm run test
```
