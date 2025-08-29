import { TaskList } from "~/app/_components/task-list";

export default function TasksPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Task Management</h1>
          <p className="text-muted-foreground">Organize your work with tasks and links</p>
        </div>
        
        <TaskList />
      </div>
    </main>
  );
}
