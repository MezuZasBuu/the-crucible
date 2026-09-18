import React from 'react';
import { DomainImpacts, DeepReadingRequestBase } from '../../types';
import { ExpandableDetailCard } from '../ui/ExpandableDetailCard';
import { SlideGallery, SlidePanel } from '../ui/SlideGallery';
import { StoryProse } from '../ui/StoryProse';

const DOMAIN_META: Array<{
  key: keyof DomainImpacts;
  label: string;
  title: string;
}> = [
  { key: 'whyToday', label: 'Why today', title: 'Why today feels this way' },
  { key: 'mood', label: 'Mood', title: 'Collective mood' },
  { key: 'people', label: 'People', title: 'People & relationships' },
  { key: 'travel', label: 'Travel', title: 'Travel & movement' },
  { key: 'finance', label: 'Finance', title: 'Money & resources' },
  { key: 'tech', label: 'Technology', title: 'Tech & messages' }
];

export const DomainImpactCards: React.FC<{
  domains: DomainImpacts;
  deepReadingBase?: DeepReadingRequestBase;
  slideIndex: number;
  onSlideIndexChange: (i: number) => void;
}> = ({ domains, deepReadingBase, slideIndex, onSlideIndexChange }) => {
  const panels = DOMAIN_META.filter(({ key }) => domains[key]).map(({ key, label, title }) => ({
    key,
    label,
    title,
    body: domains[key] as string
  }));

  if (domains.personalAlignment) {
    panels.push({
      key: 'personalAlignment' as keyof DomainImpacts,
      label: 'Your chart',
      title: 'Personal alignment',
      body: domains.personalAlignment
    });
  }

  if (panels.length === 0) return null;

  return (
    <SlideGallery
      index={Math.min(slideIndex, panels.length - 1)}
      onIndexChange={onSlideIndexChange}
      panelCount={panels.length}
      labels={panels.map((p) => p.label)}
      autoAdvanceMs={6000}
    >
      {panels.map(({ key, label, title, body }) => (
        <SlidePanel key={String(key)}>
          <ExpandableDetailCard
            label={label}
            title={title}
            body={body}
            preview={<StoryProse text={body} className="text-[1.0625rem] leading-snug" />}
            deepReading={
              deepReadingBase
                ? {
                    ...deepReadingBase,
                    domainKey: key === 'personalAlignment' ? 'personalAlignment' : key,
                    seedText: body,
                    cardTitle: title,
                    mode: key === 'personalAlignment' ? 'personal' : deepReadingBase.mode
                  }
                : undefined
            }
          />
        </SlidePanel>
      ))}
    </SlideGallery>
  );
};
