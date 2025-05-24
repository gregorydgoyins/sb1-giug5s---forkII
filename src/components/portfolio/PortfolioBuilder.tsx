import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { Plus, Save } from 'lucide-react';
import type { Project } from '../../types';

const initialProject: Project = {
  id: '',
  title: '',
  description: '',
  technologies: [],
  timeline: {
    startDate: new Date(),
    endDate: new Date()
  },
  demoUrl: '',
  githubUrl: '',
  images: [],
  role: '',
  achievements: [],
  category: 'web'
};

export function PortfolioBuilder() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === project.id ? project : p));
    } else {
      setProjects([...projects, { ...project, id: crypto.randomUUID() }]);
    }
    setIsAddingProject(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsAddingProject(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Portfolio Projects</h2>
        <button
          onClick={() => setIsAddingProject(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Project</span>
        </button>
      </div>

      {isAddingProject && (
        <ProjectForm
          project={editingProject || initialProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setIsAddingProject(false);
            setEditingProject(null);
          }}
        />
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => handleEditProject(project)}
                onDelete={() => handleDeleteProject(project.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {projects.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => console.log('Saving portfolio...', projects)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Save className="h-5 w-5" />
            <span>Save Portfolio</span>
          </button>
        </div>
      )}
    </div>
  );
}