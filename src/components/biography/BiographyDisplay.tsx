import React from 'react';
import { Calendar, Award, Briefcase, Users, BookOpen, Star } from 'lucide-react';
import type { CreatorBiography, CharacterBiography } from '../../services/biography/types';

interface BiographyDisplayProps {
  data: CreatorBiography | CharacterBiography;
  type: 'creator' | 'character';
}

export function BiographyDisplay({ data, type }: BiographyDisplayProps) {
  if (type === 'creator') {
    const creator = data as CreatorBiography;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">{creator.name}</h1>
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="h-5 w-5" />
            <span>{creator.birthDate} {creator.deathDate ? `- ${creator.deathDate}` : ''}</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">{creator.biography}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Notable Works</h2>
            </div>
            <ul className="space-y-2">
              {creator.notableWorks.map((work, index) => (
                <li key={index} className="text-gray-300">{work}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="h-5 w-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Achievements</h2>
            </div>
            <ul className="space-y-2">
              {creator.achievements.map((achievement, index) => (
                <li key={index} className="text-gray-300">{achievement}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Style & Innovation</h2>
          </div>
          <p className="text-gray-300 mb-4">{creator.style.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Innovations</h3>
              <ul className="space-y-1">
                {creator.style.innovations.map((innovation, index) => (
                  <li key={index} className="text-gray-300">{innovation}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Influences</h3>
              <ul className="space-y-1">
                {creator.style.influences.map((influence, index) => (
                  <li key={index} className="text-gray-300">{influence}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Industry Impact</h2>
            </div>
            <ul className="space-y-2">
              {creator.impact.industry.map((impact, index) => (
                <li key={index} className="text-gray-300">{impact}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-5 w-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Current Work</h2>
            </div>
            <ul className="space-y-2">
              {creator.currentWork.projects.map((project, index) => (
                <li key={index} className="text-gray-300">{project}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  } else {
    const character = data as CharacterBiography;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{character.name}</h1>
            <p className="text-gray-400">Alter Ego: {character.alterEgo}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">First Appearance</p>
            <p className="text-white">{character.firstAppearance.issue}</p>
            <p className="text-sm text-gray-400">{character.firstAppearance.date}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Origin</h2>
          <p className="text-gray-300 mb-4">{character.origin.narrative}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Powers</h3>
              <ul className="space-y-1">
                {character.origin.powers.map((power, index) => (
                  <li key={index} className="text-gray-300">{power}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Motivation</h3>
              <p className="text-gray-300">{character.origin.motivation}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-4">Key Storylines</h2>
            <div className="space-y-4">
              {character.keyStorylines.map((storyline, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-white">{storyline.title}</h3>
                  <p className="text-sm text-gray-400">{storyline.issue}</p>
                  <p className="text-gray-300">{storyline.significance}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-4">Relationships</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Allies</h3>
                <div className="flex flex-wrap gap-2">
                  {character.relationships.allies.map((ally, index) => (
                    <span key={index} className="px-3 py-1 bg-green-900/50 text-green-200 rounded-full text-sm">
                      {ally}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Enemies</h3>
                <div className="flex flex-wrap gap-2">
                  {character.relationships.enemies.map((enemy, index) => (
                    <span key={index} className="px-3 py-1 bg-red-900/50 text-red-200 rounded-full text-sm">
                      {enemy}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Significance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Cultural Impact</h3>
              <p className="text-gray-300">{character.significance.cultural}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Industry Impact</h3>
              <p className="text-gray-300">{character.significance.industry}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Legacy</h3>
              <p className="text-gray-300">{character.significance.impact}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}