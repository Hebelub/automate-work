"use client";

import { useState, useEffect } from "react";
import { TaskCard } from "./task-card";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface Link {
  id: string;
  url: string;
  description: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  links: Link[];
  createdAt: number;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('web-tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      } catch (error) {
        console.error('Failed to parse saved tasks:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('web-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleCreateNewTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: "",
      description: "",
      links: [],
      todos: [],
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleAddLinkToTask = (taskId: string) => {
    const newLink: Link = {
      id: Date.now().toString(),
      url: "",
      description: "",
    };
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, links: [...task.links, newLink] }
        : task
    ));
  };

  const handleUpdateLink = (taskId: string, linkId: string, updatedLink: Partial<Link>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            links: task.links.map(link => 
              link.id === linkId ? { ...link, ...updatedLink } : link
            )
          }
        : task
    ));
  };

  const handleDeleteLink = (taskId: string, linkId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, links: task.links.filter(link => link.id !== linkId) }
        : task
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-6">
        <Button onClick={handleCreateNewTask}>
          Create New Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-4">Create your first task to get started!</p>
            <Button onClick={handleCreateNewTask}>
              Create First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={(updatedTask) => handleUpdateTask(task.id, updatedTask)}
            onDelete={() => handleDeleteTask(task.id)}
            onAddLink={() => handleAddLinkToTask(task.id)}
            onUpdateLink={(linkId, updatedLink) => handleUpdateLink(task.id, linkId, updatedLink)}
            onDeleteLink={(linkId) => handleDeleteLink(task.id, linkId)}
          />
        ))
      )}
    </div>
  );
}
