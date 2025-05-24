'use client';

import React, { useState, useEffect } from 'react';
import { FinancialLink } from './FinancialLink';
import type { LinkStatus } from './types';

interface LinkManagerProps {
  content: string;
}

export function LinkManager({ content }: LinkManagerProps) {
  const [processedContent, setProcessedContent] = useState(content);
  const [linkStatuses, setLinkStatuses] = useState<Map<string, LinkStatus>>(new Map());

  useEffect(() => {
    const processLinks = async () => {
      const patterns = {
        stock: /\b[A-Z]{1,5}\b/g,
        bond: /\b[A-Z0-9]{9}\b/g,
        option: /\b[A-Z]{1,5}\d{6}[CP]\d{8}\b/g,
        person: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g
      };

      const newStatuses = new Map<string, LinkStatus>();
      let newContent = content;

      for (const [type, pattern] of Object.entries(patterns)) {
        const matches = content.match(pattern) || [];
        
        for (const match of matches) {
          if (!newStatuses.has(match)) {
            const status = await checkLinkStatus(match, type);
            newStatuses.set(match, status);
            
            const replacement = `<FinancialLink type="${type}" symbol="${match}" name="${match}" hasContent={${status.hasContent}} />`;
            newContent = newContent.replace(match, replacement);
          }
        }
      }

      setLinkStatuses(newStatuses);
      setProcessedContent(newContent);
    };

    processLinks();
  }, [content]);

  return (
    <div className="prose prose-invert">
      {processedContent.split(/(<FinancialLink.*?\/\>)/).map((part, index) => {
        if (part.startsWith('<FinancialLink')) {
          const props = {
            type: part.match(/type="([^"]+)"/)?.[1],
            symbol: part.match(/symbol="([^"]+)"/)?.[1],
            name: part.match(/name="([^"]+)"/)?.[1],
            hasContent: part.includes('hasContent={true}')
          };

          if (props.type && props.symbol && props.name) {
            return (
              <FinancialLink
                key={index}
                type={props.type as any}
                symbol={props.symbol}
                name={props.name}
                hasContent={props.hasContent}
              />
            );
          }
        }
        return part;
      })}
    </div>
  );
}

async function checkLinkStatus(symbol: string, type: string): Promise<LinkStatus> {
  const response = await fetch(`/api/links/status?symbol=${symbol}&type=${type}`);
  if (!response.ok) {
    return { exists: false, hasContent: false };
  }
  return response.json();
}