import TaskBoard from "@/components/TaskBoard";
import { LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function BoardPage() {
  return (
    <main className="h-screen w-full flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0b0f19]">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <TaskBoard />
      </div>
    </main>
  );
}
