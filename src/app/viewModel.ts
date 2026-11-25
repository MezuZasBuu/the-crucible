export type PrimaryDestination = 'TODAY' | 'YOU' | 'TIMELINE' | 'EXPLORE';

export type ExploreTab = 'SYSTEMS' | 'CALENDARS' | 'ENOCHIAN' | 'GEARS' | 'MAP' | 'REPORT' | 'COMPASS';

export const EXPLORE_TABS: Array<{ id: ExploreTab; label: string; description: string }> = [
  { id: 'SYSTEMS', label: 'All traditions', description: 'Every calendar and system for this day, side by side, each with a short explanation.' },
  { id: 'CALENDARS', label: '13-Moon calendar', description: 'The Dreamspell calendar: 13 months of 28 days, with a symbol and number for every day.' },
  { id: 'ENOCHIAN', label: 'Seasons & hours', description: 'The four seasons of the ancient 364-day calendar, and which planet names this day and hour.' },
  { id: 'GEARS', label: 'Cycle wheels', description: 'A moving diagram of how the different calendar cycles turn against each other.' },
  { id: 'MAP', label: 'World map', description: 'Where each planet is rising, setting or overhead around the world right now.' },
  { id: 'REPORT', label: 'Full report', description: 'Everything in one long written report, with name analysis if you enter a name.' },
  { id: 'COMPASS', label: 'Ask a question', description: 'Ask about today in your own words and get an answer drawn from these traditions.' }
];
