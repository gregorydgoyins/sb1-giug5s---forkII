```typescript
import React from 'react';
import { Calendar, Users, AlertTriangle, Sparkles, GitBranch } from 'lucide-react';
import { BiographyLink } from '../biography/BiographyLink';
import type { IssueSynopsis as Synopsis } from '../../services/synopsis/types';

interface IssueSynopsisProps {
  synopsis: Synopsis;
}

export function IssueSynopsis({ synopsis }: IssueSynopsisProps) {
  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {synopsis.title} #{synopsis.issueNumber}
          </h2>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center text-gray-400">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{synopsis.publicationDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-2">Creative Team</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(synopsis.creativeTeam).map(([role, creators]) => (
            <div key={role}>
              <p className="text-sm text-gray-400 capitalize">{role}:</p>
              <div className="space-y-1">
                {creators.map(creator => (
                  <BiographyLink
                    key={creator}
                    creatorId={creator.toLowerCase().replace(/\s+/g, '-')}
                    creatorName={creator}
                    hasContent={true}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Plot Summary</h3>
        <p className="text-gray-300">{synopsis.plotSummary}</p>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Users className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Character Roster</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {synopsis.characters.map(character => (
            <div 
              key={character.id}
              className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-white">{character.name}</h4>
                  <p className="text-sm text-gray-400 capitalize">{character.role}</p>
                </div>
                {character.firstAppearance && (
                  <span className="px-2 py-1 bg-indigo-900/50 text-indigo-200 rounded-full text-xs">
                    First Appearance
                  </span>
                )}
              </div>
              {character.developments.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {character.developments.map((dev, i) => (
                    <li key={i} className="text-sm text-gray-300">
                      • {dev}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {synopsis.revelations.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Critical Revelations</h3>
          </div>
          <div className="space-y-2">
            {synopsis.revelations.map((revelation, i) => (
              <div 
                key={i}
                className="bg-yellow-900/20 border border-yellow-700/20 p-4 rounded-lg"
              >
                <p className="text-yellow-200">SPOILER: {revelation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {synopsis.statusQuoChanges.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Status Quo Changes</h3>
          </div>
          <ul className="space-y-2">
            {synopsis.statusQuoChanges.map((change, i) => (
              <li key={i} className="text-gray-300">• {change}</li>
            ))}
          </ul>
        </div>
      )}

      {synopsis.continuityLinks.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <GitBranch className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Continuity Connections</h3>
          </div>
          <div className="space-y-4">
            {synopsis.continuityLinks.map(link => (
              <div 
                key={link.issueId}
                className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{link.title}</h4>
                  <span className="px-2 py-1 bg-slate-800 text-gray-300 rounded-full text-xs capitalize">
                    {link.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{link.description}</p>
                {link.impact && (
                  <p className="text-sm text-indigo-300 mt-2">Impact: {link.impact}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {synopsis.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {synopsis.tags.map(tag => (
            <span 
              key={tag}
              className="px-3 py-1 bg-indigo-900/50 text-indigo-200 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```