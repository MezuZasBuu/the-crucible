import React from 'react';
import { DomainImpacts, DeepReadingRequestBase } from '../../types';
import { ExpandableDetailCard } from '../ui/ExpandableDetailCard';

const DOMAIN_META: Array<{
  key: keyof DomainImpacts;
  label: string;
  title: string;
  accent: 'solar' | 'rose' | 'indigo' | 'sage' | 'ochre' | 'slate';
}> = [
  { key: 'whyToday', label: 'Why today feels this way', title: 'Why today', accent: 'solar' },
  { key: 'mood', label: 'Collective mood', title: 'Mood', accent: 'rose' },
  { key: 'people', label: 'People & relationships', title: 'People', accent: 'indigo' },
  { key: 'travel', label: 'Travel & movement', title: 'Travel', accent: 'sage' },
  { key: 'finance', label: 'Money & resources', title: 'Finance', accent: 'ochre' },
  { key: 'tech', label: 'Tech & messages', title: 'Technology', accent: 'slate' }
];

export const DomainImpactCards: React.FC<{
  domains: DomainImpacts;
  deepReadingBase?: DeepReadingRequestBase;
}> = ({ domains, deepReadingBase }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
    {DOMAIN_META.map(({ key, label, title, accent }) => {
      const body = domains[key];
      if (!body) return null;
      return (
        <ExpandableDetailCard
          key={key}
          label={label}
          accent={accent}
          title={title}
          body={body}
          preview={<p className="readable-body font-semibold">{body}</p>}
          deepReading={
            deepReadingBase
              ? {
                  ...deepReadingBase,
                  domainKey: key,
                  seedText: body,
                  cardTitle: title
                }
              : undefined
          }
        />
      );
    })}
    {domains.personalAlignment && (
      <ExpandableDetailCard
        label="Your chart alignment"
        accent="terracotta"
        title="Personal alignment"
        body={domains.personalAlignment}
        preview={<p className="readable-body font-semibold">{domains.personalAlignment}</p>}
        deepReading={
          deepReadingBase
            ? {
                ...deepReadingBase,
                domainKey: 'personalAlignment',
                seedText: domains.personalAlignment,
                cardTitle: 'Personal alignment',
                mode: 'personal'
              }
            : undefined
        }
      />
    )}
  </div>
);
