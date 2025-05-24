import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, GripVertical, ExternalLink, Github } from 'lucide-react';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-6 hover:bg-slate-700 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <p className="text-gray-400">{project.role}</p>
            </div>
          </div>
          <p className="mt-2 text-gray-300">{project.description}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-slate-800/50 text-indigo-300 rounded-full text-sm"
          >
            {tech}
          </span>
        ))}
      </div>

      {project.images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {project.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${project.title} screenshot ${index + 1}`}
              className="rounded-lg w-full h-32 object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-gray-400">
          {new Date(project.timeline.startDate).toLocaleDateString()} - {' '}
          {new Date(project.timeline.endDate).toLocaleDateString()}
        </div>
        <div className="flex space-x-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Demo</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300"
            >
              <Github className="h-4 w-4" />
              <span>Code</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}