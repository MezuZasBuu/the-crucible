export type PrimaryDestination = 'TODAY' | 'YOU' | 'TIMELINE' | 'EXPLORE';

export type ExploreTab = 'SYSTEMS' | 'CALENDARS' | 'ENOCHIAN' | 'GEARS' | 'MAP' | 'REPORT' | 'COMPASS';

export const EXPLORE_TABS: Array<{ id: ExploreTab; label: string }> = [
  { id: 'SYSTEMS', label: 'Systems' },
  { id: 'CALENDARS', label: 'Calendars' },
  { id: 'ENOCHIAN', label: 'Enochian' },
  { id: 'GEARS', label: 'Gears' },
  { id: 'MAP', label: 'Map' },
  { id: 'REPORT', label: 'Report' },
  { id: 'COMPASS', label: 'Compass' }
];
