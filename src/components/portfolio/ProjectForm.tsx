import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import type { Project } from '../../types';

interface ProjectFormProps {
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(project);
  const [newTech, setNewTech] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 4)
    }));
  };

  const addTechnology = () => {
    if (newTech.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Project Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white h-24"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.timeline.startDate.toISOString().split('T')[0]}
              onChange={e => setFormData({
                ...formData,
                timeline: {
                  ...formData.timeline,
                  startDate: new Date(e.target.value)
                }
              })}
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.timeline.endDate.toISOString().split('T')[0]}
              onChange={e => setFormData({
                ...formData,
                timeline: {
                  ...formData.timeline,
                  endDate: new Date(e.target.value)
                }
              })}
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Demo URL
            </label>
            <input
              type="url"
              value={formData.demoUrl}
              onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Technologies
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTech}
              onChange={e => setNewTech(e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
              placeholder="Add technology..."
            />
            <button
              type="button"
              onClick={addTechnology}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-800/50 text-indigo-300 rounded-full text-sm flex items-center space-x-1"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    technologies: prev.technologies.filter((_, i) => i !== index)
                  }))}
                  className="text-indigo-300 hover:text-indigo-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Project Images (Max 4)
          </label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Project screenshot ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index)
                  }))}
                  className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.images.length < 4 && (
              <label className="w-full h-32 flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                />
                <Upload className="h-6 w-6 text-slate-400" />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Save Project
          </button>
        </div>
      </div>
    </form>
  );
}