import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getCreatorUrl, getFundUrl, getBondUrl, getOptionChainUrl } from '../utils/links';

interface EntityLinkProps {
  type: 'creator' | 'fund' | 'bond' | 'option';
  symbol: string;
  name: string;
  external?: boolean;
  className?: string;
}

export const EntityLink: React.FC<EntityLinkProps> = ({
  type,
  symbol,
  name,
  external = false,
  className = ''
}) => {
  const navigate = useNavigate();

  const getExternalUrl = () => {
    switch (type) {
      case 'creator': return getCreatorUrl(symbol);
      case 'fund': return getFundUrl(symbol);
      case 'bond': return getBondUrl(symbol);
      case 'option': return getOptionChainUrl(symbol);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (external) {
      window.open(getExternalUrl(), '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/${type}/${symbol}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center space-x-1 hover:text-indigo-400 transition-colors ${className}`}
    >
      <span>{name}</span>
      {external && <ExternalLink className="h-4 w-4" />}
    </button>
  );
};