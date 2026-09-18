/**
 * Unified world-energy swipe gallery — all domain and atmosphere panels in one track.
 */

import React from 'react';
import { DailyBearing, DeepReadingRequestBase } from '../../types';
import { ExpandableDetailCard } from '../ui/ExpandableDetailCard';
import { SlideGallery, SlidePanel } from '../ui/SlideGallery';
import { StoryProse } from '../ui/StoryProse';

type PanelDef = {
  key: string;
  label: string;
  title: string;
  body: string;
  domainKey: string;
};

function buildPanels(bearing: DailyBearing): PanelDef[] {
  const panels: PanelDef[] = [
    {
      key: 'emotional',
      label: 'Emotional',
      title: 'Emotional atmosphere',
      body: bearing.atmospheres.emotional,
      domainKey: 'emotional'
    },
    {
      key: 'social',
      label: 'Social',
      title: 'Social atmosphere',
      body: bearing.atmospheres.social,
      domainKey: 'social'
    },
    {
      key: 'workCreative',
      label: 'Work & creative',
      title: 'Work and creative energy',
      body: bearing.atmospheres.workCreative,
      domainKey: 'workCreative'
    },
    {
      key: 'mood',
      label: 'Mood',
      title: 'Collective mood',
      body: bearing.domains.mood,
      domainKey: 'mood'
    },
    {
      key: 'people',
      label: 'People',
      title: 'People and relationships',
      body: bearing.domains.people,
      domainKey: 'people'
    },
    {
      key: 'travel',
      label: 'Travel',
      title: 'Travel and movement',
      body: bearing.domains.travel,
      domainKey: 'travel'
    },
    {
      key: 'finance',
      label: 'Finance',
      title: 'Money and resources',
      body: bearing.domains.finance,
      domainKey: 'finance'
    },
    {
      key: 'tech',
      label: 'Technology',
      title: 'Technology and messages',
      body: bearing.domains.tech,
      domainKey: 'tech'
    },
    {
      key: 'whyToday',
      label: 'Why today',
      title: 'Why today feels this way',
      body: bearing.domains.whyToday,
      domainKey: 'whyToday'
    }
  ];

  if (bearing.domains.personalAlignment) {
    panels.push({
      key: 'personalAlignment',
      label: 'Your chart',
      title: 'Personal alignment',
      body: bearing.domains.personalAlignment,
      domainKey: 'personalAlignment'
    });
  }

  return panels;
}

export const WorldEnergyGallery: React.FC<{
  bearing: DailyBearing;
  deepReadingBase?: DeepReadingRequestBase;
  slideIndex: number;
  onSlideIndexChange: (i: number) => void;
}> = ({ bearing, deepReadingBase, slideIndex, onSlideIndexChange }) => {
  const panels = buildPanels(bearing);
  const idx = Math.min(slideIndex, panels.length - 1);

  return (
    <SlideGallery
      index={idx}
      onIndexChange={onSlideIndexChange}
      panelCount={panels.length}
      labels={panels.map((p) => p.label)}
      autoAdvanceMs={6000}
    >
      {panels.map((panel) => (
        <SlidePanel key={panel.key}>
          <ExpandableDetailCard
            label={panel.label}
            title={panel.title}
            body={panel.body}
            preview={<StoryProse text={panel.body} className="text-[1.0625rem] leading-relaxed" />}
            deepReading={
              deepReadingBase
                ? {
                    ...deepReadingBase,
                    domainKey: panel.domainKey as any,
                    seedText: panel.body,
                    cardTitle: panel.title,
                    mode:
                      panel.domainKey === 'personalAlignment' ? 'personal' : deepReadingBase.mode
                  }
                : undefined
            }
          />
        </SlidePanel>
      ))}
    </SlideGallery>
  );
};
