"use client";

import { Badge } from "~/components/ui/badge";
import { ActionPoint } from "~/lib/action-points";

interface ActionPointsProps {
  actionPoints: ActionPoint[];
}

export function ActionPoints({ actionPoints }: ActionPointsProps) {
  if (actionPoints.length === 0) {
    return null;
  }

  const getPriorityColor = (priority: ActionPoint['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: ActionPoint['type']) => {
    switch (type) {
      case 'github':
        return '🐙';
      case 'jira':
        return '📋';
      default:
        return '🔗';
    }
  };

  return (
    <div className="mt-2 space-y-1">
      {actionPoints.map((action) => (
        <div
          key={action.id}
          className="flex items-center gap-2 text-xs"
        >
          <span className="text-xs">{getTypeIcon(action.type)}</span>
          <Badge
            variant="outline"
            className={`${getPriorityColor(action.priority)} text-xs px-2 py-0.5`}
          >
            {action.text}
          </Badge>
        </div>
      ))}
    </div>
  );
}
