"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";

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

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Partial<Task>) => void;
  onDelete: () => void;
  onAddLink: () => void;
  onUpdateLink: (linkId: string, updatedLink: Partial<Link>) => void;
  onDeleteLink: (linkId: string) => void;
}

export function TaskCard({ task, onUpdate, onDelete, onAddLink, onUpdateLink, onDeleteLink }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || "",
  });

  const handleSave = () => {
    if (!editData.title.trim()) {
      alert("Task title cannot be empty");
      return;
    }
    
    onUpdate({
      title: editData.title.trim(),
      description: editData.description.trim(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description || "",
    });
    setIsEditing(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          {isEditing ? (
            <div className="flex-1 mr-4">
              <Label htmlFor={`title-${task.id}`} className="text-sm font-medium text-muted-foreground">
                Task Title
              </Label>
              <Input
                id={`title-${task.id}`}
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                className="mt-1"
              />
            </div>
          ) : (
            <CardTitle className="text-xl">{task.title || "Untitled Task"}</CardTitle>
          )}
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this task?")) {
                      onDelete();
                    }
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEditing ? (
          <div>
            <Label htmlFor={`description-${task.id}`} className="text-sm font-medium text-muted-foreground">
              Description (optional)
            </Label>
            <Textarea
              id={`description-${task.id}`}
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={3}
              className="mt-1"
            />
          </div>
        ) : (
          task.description && (
            <p className="text-muted-foreground">{task.description}</p>
          )
        )}

        {/* Links Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Links ({task.links.length})</h4>
            <Button size="sm" onClick={onAddLink}>
              Add Link
            </Button>
          </div>
          
          {task.links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links added yet. Click "Add Link" to get started.</p>
          ) : (
            <div className="space-y-2">
              {task.links.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  onUpdate={(updatedLink) => onUpdateLink(link.id, updatedLink)}
                  onDelete={() => onDeleteLink(link.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Created: {formatDate(task.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}

// LinkItem component for individual links within a task
function LinkItem({ link, onUpdate, onDelete }: { 
  link: Link; 
  onUpdate: (updatedLink: Partial<Link>) => void; 
  onDelete: () => void; 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    url: link.url,
    description: link.description || "",
  });

  const handleSave = () => {
    if (!editData.url.trim()) {
      alert("URL cannot be empty");
      return;
    }
    
    try {
      new URL(editData.url); // Validate URL format
    } catch {
      alert("Please enter a valid URL");
      return;
    }
    
    onUpdate({
      url: editData.url.trim(),
      description: editData.description.trim(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      url: link.url,
      description: link.description || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="border rounded-lg p-3 bg-muted/30">
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <Label htmlFor={`url-${link.id}`} className="text-sm font-medium text-muted-foreground">
              URL
            </Label>
            <Input
              id={`url-${link.id}`}
              value={editData.url}
              onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`desc-${link.id}`} className="text-sm font-medium text-muted-foreground">
              Description (optional)
            </Label>
            <Input
              id={`desc-${link.id}`}
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Link description"
              className="mt-1"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all font-medium"
            >
              {link.url}
            </a>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this link?")) {
                    onDelete();
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
          {link.description && (
            <p className="text-sm text-muted-foreground">{link.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
