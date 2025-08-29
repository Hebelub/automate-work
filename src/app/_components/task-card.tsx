"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { GitHubService, type GitHubPRInfo, type GitHubRepoInfo, type GitHubBranchInfo } from "~/lib/github";
import { JiraService, type JiraTaskInfo } from "~/lib/jira";
import { getActionPointsForLinks, type ActionPoint } from "~/lib/action-points";
import { ActionPoints } from "./action-points";

interface Link {
  id: string;
  url: string;
  description: string;
  githubInfo?: GitHubPRInfo | GitHubRepoInfo | GitHubBranchInfo | null;
  jiraInfo?: JiraTaskInfo | null;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  links: Link[];
  todos: Todo[];
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
  const [newTodoText, setNewTodoText] = useState("");
  const [newDescription, setNewDescription] = useState(task.description || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(task.title || "");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
    };
    
    onUpdate({
      todos: [...(task.todos || []), newTodo],
    });
    setNewTodoText("");
  };

  const handleToggleTodo = (todoId: string) => {
    const updatedTodos = (task.todos || []).map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    onUpdate({ todos: updatedTodos });
  };

  const handleDeleteTodo = (todoId: string) => {
    const updatedTodos = (task.todos || []).filter(todo => todo.id !== todoId);
    onUpdate({ todos: updatedTodos });
  };

  const handleDescriptionChange = (value: string) => {
    setNewDescription(value);
    onUpdate({ description: value });
  };

  // Listen for title suggestions from Jira links
  useEffect(() => {
    const handleTitleSuggestion = (event: Event) => {
      const customEvent = event as CustomEvent<{ source: string; title: string }>;
      if (customEvent.detail?.source === 'jira' && customEvent.detail?.title) {
        setTitleText(customEvent.detail.title);
        onUpdate({ title: customEvent.detail.title });
      }
    };

    window.addEventListener('suggestTaskTitle', handleTitleSuggestion);
    
    return () => {
      window.removeEventListener('suggestTaskTitle', handleTitleSuggestion);
    };
  }, [onUpdate]);

  return (
    <Card className="hover:shadow-md transition-shadow">
             <CardHeader>
         <div className="flex justify-between items-start">
           <div className="flex-1">
             {isEditingTitle ? (
               <div className="flex items-center gap-2">
                 <Input
                   value={titleText}
                   onChange={(e) => setTitleText(e.target.value)}
                   className="text-xl font-semibold h-8"
                   autoFocus
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                       onUpdate({ title: titleText });
                       setIsEditingTitle(false);
                     } else if (e.key === 'Escape') {
                       setTitleText(task.title || "");
                       setIsEditingTitle(false);
                     }
                   }}
                   onBlur={() => {
                     onUpdate({ title: titleText });
                     setIsEditingTitle(false);
                   }}
                 />
               </div>
             ) : (
               <CardTitle 
                 className="text-xl cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                 onClick={() => setIsEditingTitle(true)}
               >
                 {task.title || "Untitled Task"}
               </CardTitle>
             )}
           </div>
           
           <Button
             variant="ghost"
             size="sm"
             onClick={() => {
               if (confirm("Are you sure you want to delete this task?")) {
                 onDelete();
               }
             }}
             className="h-8 w-8 p-0 hover:bg-muted hover:text-destructive"
           >
             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
             </svg>
           </Button>
         </div>
       </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Links Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Links ({task.links.length})</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={onAddLink}
              className="h-8 w-8 p-0 hover:bg-muted rounded-full"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>
          
          {task.links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links added yet. Click the + button to get started.</p>
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

        {/* Todos Section */}
        <div className="space-y-3">
          <h4 className="font-medium">Todos ({(task.todos || []).length})</h4>
          
          {/* Add new todo */}
          <div className="flex gap-2">
            <Input
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new todo..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              className="flex-1"
            />
            <Button size="sm" onClick={handleAddTodo}>
              Add
            </Button>
          </div>
          
          {/* Todo list */}
          {(task.todos || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No todos yet. Add one above to get started.</p>
          ) : (
            <div className="space-y-2">
              {(task.todos || []).map((todo) => (
                <div 
                  key={todo.id} 
                  className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleToggleTodo(todo.id)}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="h-4 w-4"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {todo.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTodo(todo.id);
                    }}
                    className="h-6 w-6 p-0 hover:bg-muted hover:text-destructive"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Always-editable Description Section */}
        <div className="space-y-2">
          <Label htmlFor={`description-${task.id}`} className="text-sm font-medium text-muted-foreground">
            Description
          </Label>
          <Textarea
            id={`description-${task.id}`}
            value={newDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Add a description for this task..."
            rows={3}
            className="resize-none"
          />
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
  // Start in edit mode if the link has no URL (newly created)
  const [isEditing, setIsEditing] = useState(!link.url.trim());
  const [editData, setEditData] = useState({
    url: link.url,
    description: link.description || "",
  });
  
     // GitHub information state
   const [githubInfo, setGithubInfo] = useState<{
     type: string;
     owner: string;
     repo: string;
     pr?: string;
     branch?: string;
     prInfo?: GitHubPRInfo | null;
     repoInfo?: GitHubRepoInfo | null;
     branchInfo?: GitHubBranchInfo | null;
   } | null>(null);
   const [isLoadingGithub, setIsLoadingGithub] = useState(false);
   
   // Jira information state
   const [jiraInfo, setJiraInfo] = useState<JiraTaskInfo | null>(null);
   const [isLoadingJira, setIsLoadingJira] = useState(false);

     // Fetch GitHub and Jira information when URL changes
   useEffect(() => {
     if (link.url && !isEditing) {
       // Fetch GitHub information
       const fetchGitHubInfo = async () => {
         setIsLoadingGithub(true);
         try {
           const info = await GitHubService.fetchGitHubInfo(link.url);
           setGithubInfo(info);
         } catch (error) {
           console.error('Error fetching GitHub info:', error);
         } finally {
           setIsLoadingGithub(false);
         }
       };

       // Fetch Jira information
       const fetchJiraInfo = async () => {
         setIsLoadingJira(true);
         try {
           const info = await JiraService.fetchJiraTaskInfo(link.url);
           setJiraInfo(info);
           
           // If this is a Jira link and we have task info, suggest updating the task title
           if (info?.summary) {
             // Emit an event to suggest updating the task title
             const event = new CustomEvent('suggestTaskTitle', {
               detail: { title: info.summary, source: 'jira' }
             });
             window.dispatchEvent(event);
           }
         } catch (error) {
           console.error('Error fetching Jira info:', error);
         } finally {
           setIsLoadingJira(false);
         }
       };

       void fetchGitHubInfo();
       void fetchJiraInfo();
     }
   }, [link.url, isEditing]);

  // Function to get link type and icon
  const getLinkInfo = (url: string) => {
    if (!url) return { type: 'other', icon: null };
    
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('jira') || lowerUrl.includes('atlassian.net')) {
      return { 
        type: 'jira', 
        icon: (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.797 24h8.376a5.215 5.215 0 0 0 5.215-5.214v-7.273a5.215 5.215 0 0 0-5.215-5.214H11.571zm5.723-5.756a5.215 5.215 0 0 0-5.215 5.214H5.736a5.215 5.215 0 0 0-5.215 5.215v7.273a5.215 5.215 0 0 0 5.215 5.214h8.376a5.215 5.215 0 0 0 5.215-5.214V11.513a5.215 5.215 0 0 0-5.215-5.214z"/>
          </svg>
        )
      };
    } else if (lowerUrl.includes('github.com')) {
      return { 
        type: 'github', 
        icon: (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )
      };
    }
    return { type: 'other', icon: null };
  };

     const handleSave = () => {
     if (!editData.url.trim()) {
       // Don't save empty URLs - just exit edit mode
       setIsEditing(false);
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
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getLinkInfo(link.url).icon && (
              <div className="flex-shrink-0 text-muted-foreground">
                {getLinkInfo(link.url).icon}
              </div>
            )}
                         {isEditing ? (
               <Input
                 value={editData.url}
                 onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
                 placeholder="https://example.com"
                 className="flex-1 min-w-0"
                 autoFocus={!link.url.trim()}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     handleSave();
                   } else if (e.key === 'Escape') {
                     handleCancel();
                   }
                 }}
               />
             ) : (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all font-medium flex-1 min-w-0"
              >
                {link.url}
              </a>
            )}
          </div>
          <div className="flex gap-1">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="h-7 w-7 p-0 hover:bg-muted"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-7 w-7 p-0 hover:bg-muted"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-7 w-7 p-0 hover:bg-muted"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="h-7 w-7 p-0 hover:bg-muted hover:text-destructive"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </>
            )}
          </div>
        </div>
        
                 {/* Description field - always visible */}
         <div className="flex items-center gap-2">
                      {isEditing ? (
              <Input
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Link description (optional)"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave();
                  } else if (e.key === 'Escape') {
                    handleCancel();
                  }
                }}
              />
            ) : (
             link.description && (
               <p className="text-sm text-muted-foreground flex-1">{link.description}</p>
             )
           )}
         </div>
         
                   {/* GitHub Information Display */}
          {!isEditing && githubInfo && (
            <div className="mt-3 p-2 bg-muted/20 rounded border-l-2 border-primary/30">
              {isLoadingGithub ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
                  Loading GitHub information...
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Repository Info */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Repo:</span>
                    <span className="text-xs">{githubInfo.owner}/{githubInfo.repo}</span>
                  </div>
                  
                  {/* PR Information */}
                  {githubInfo.type === 'pr' && githubInfo.prInfo && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-primary">{githubInfo.prInfo.title}</div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>#{githubInfo.pr}</span>
                        <span>Branch: {githubInfo.prInfo.headRefName}</span>
                                                <span className={`px-2 py-0.5 rounded text-xs ${
                           githubInfo.prInfo.mergedAt 
                             ? 'bg-green-100 text-green-800' 
                             : githubInfo.prInfo.state === 'OPEN'
                             ? 'bg-blue-100 text-blue-800'
                             : 'bg-gray-100 text-gray-800'
                         }`}>
                           {githubInfo.prInfo.mergedAt ? 'Merged' : githubInfo.prInfo.state}
                         </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Branch Information */}
                  {githubInfo.type === 'branch' && githubInfo.branchInfo && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-primary">Branch: {githubInfo.branchInfo.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Last commit: {githubInfo.branchInfo.commit.commit.message.substring(0, 50)}...
                      </div>
                    </div>
                  )}
                  
                  {/* Repository Information */}
                  {githubInfo.type === 'repo' && githubInfo.repoInfo && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-primary">{githubInfo.repoInfo.name}</div>
                      {githubInfo.repoInfo.description && (
                        <div className="text-xs text-muted-foreground">
                          {githubInfo.repoInfo.description}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Default: {githubInfo.repoInfo.defaultBranchRef.name}</span>
                        <span>⭐ {githubInfo.repoInfo.stargazerCount}</span>
                        <span>🔀 {githubInfo.repoInfo.forkCount}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
                     {/* Jira Information Display */}
           {!isEditing && jiraInfo && (
             <div className="mt-3 p-2 bg-muted/20 rounded border-l-2 border-blue-500/30">
               {isLoadingJira ? (
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-500"></div>
                   Loading Jira information...
                 </div>
               ) : (
                 <div className="space-y-2">
                   {/* Task Info */}
                   <div className="space-y-1">
                     <div className="text-xs font-medium text-blue-600">{jiraInfo.summary}</div>
                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
                       <span className="font-mono">{jiraInfo.key}</span>
                       <span className={`px-2 py-0.5 rounded text-xs ${
                         jiraInfo.status === 'Done' || jiraInfo.status === 'Closed'
                           ? 'bg-green-100 text-green-800'
                           : jiraInfo.status === 'In Progress'
                           ? 'bg-blue-100 text-blue-800'
                           : 'bg-gray-100 text-gray-800'
                       }`}>
                         {jiraInfo.status}
                       </span>
                       {jiraInfo.priority && (
                         <span className="px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-800">
                           {jiraInfo.priority}
                         </span>
                       )}
                     </div>
                     {jiraInfo.assignee && (
                       <div className="text-xs text-muted-foreground">
                         Assignee: {jiraInfo.assignee}
                       </div>
                     )}
                     {jiraInfo.labels.length > 0 && (
                       <div className="flex flex-wrap gap-1">
                         {jiraInfo.labels.slice(0, 3).map((label, index) => (
                           <span key={index} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                             {label}
                           </span>
                         ))}
                         {jiraInfo.labels.length > 3 && (
                           <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                             +{jiraInfo.labels.length - 3} more
                           </span>
                         )}
                       </div>
                     )}
                   </div>
                 </div>
               )}
             </div>
           )}
           
           {/* Action Points for this specific link */}
           {!isEditing && (
             <ActionPoints 
               actionPoints={getActionPointsForLinks([{
                 url: link.url,
                 githubInfo: githubInfo?.prInfo ?? null,
                 jiraInfo: jiraInfo
               }])} 
             />
           )}
      </div>
    </div>
  );
}
