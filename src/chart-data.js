// The charts' sample data, shared by the chart pages: orders by week and
// region, visits by day and channel, disk use, and study hours against
// scores.

/** Orders by week, per region. */
export const ORDERS = [
  { week: 'W1', North: 1480, East: 920, West: 1310 },
  { week: 'W2', North: 1620, East: 1180, West: 1240 },
  { week: 'W3', North: 1350, East: 1540, West: 870 },
  { week: 'W4', North: 1910, East: 1260, West: 1450 },
  { week: 'W5', North: 1740, East: 1690, West: 1120 },
  { week: 'W6', North: 2050, East: 1410, West: 1580 },
];

/** The region series and their colors. */
export const REGIONS = [
  { key: 'North', color: 'cyan.6' },
  { key: 'East', color: 'orange.6' },
  { key: 'West', color: 'purple.6' },
];

/** Visits by day, per channel. */
export const VISITS = [
  { day: 'Mon', Search: 640, Direct: 310, Referral: 150 },
  { day: 'Tue', Search: 720, Direct: 280, Referral: 390 },
  { day: 'Wed', Search: 580, Direct: 450, Referral: 210 },
  { day: 'Thu', Search: 810, Direct: 370, Referral: 260 },
  { day: 'Fri', Search: 690, Direct: 520, Referral: 330 },
  { day: 'Sat', Search: 340, Direct: 610, Referral: 180 },
  { day: 'Sun', Search: 290, Direct: 470, Referral: 120 },
];

/** The channel series. */
export const CHANNELS = [
  { key: 'Search', color: 'indigo.5' },
  { key: 'Direct', color: 'lime.6' },
  { key: 'Referral', color: 'magenta.5' },
];

/** Shares of a disk, with their colors. */
export const DISK = [
  { label: 'Photos', value: 340, color: 'purple.6' },
  { label: 'Video', value: 260, color: 'cyan.6' },
  { label: 'Documents', value: 150, color: 'orange.6' },
  { label: 'Free', value: 250, color: 'gray.5' },
];

/** Two classes: weekly study hours against the test score. */
export const STUDY = [
  {
    color: 'teal.5',
    label: 'Morning class',
    points: [
      { hours: 2, score: 54 },
      { hours: 4, score: 61 },
      { hours: 5, score: 58 },
      { hours: 7, score: 70 },
      { hours: 8, score: 76 },
      { hours: 3, score: 49 },
      { hours: 10, score: 83 },
      { hours: 6, score: 66 },
      { hours: 9, score: 79 },
      { hours: 12, score: 88 },
    ],
  },
  {
    color: 'orange.5',
    label: 'Evening class',
    points: [
      { hours: 1, score: 42 },
      { hours: 3, score: 57 },
      { hours: 4, score: 52 },
      { hours: 6, score: 63 },
      { hours: 7, score: 61 },
      { hours: 9, score: 72 },
      { hours: 11, score: 74 },
      { hours: 5, score: 60 },
      { hours: 8, score: 68 },
      { hours: 13, score: 81 },
    ],
  },
];

