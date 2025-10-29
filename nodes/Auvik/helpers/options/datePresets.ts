export type DateRangePreset =
  | 'LAST_5_MINUTES'
  | 'LAST_15_MINUTES'
  | 'LAST_30_MINUTES'
  | 'LAST_1_HOUR'
  | 'LAST_2_HOURS'
  | 'LAST_4_HOURS'
  | 'LAST_6_HOURS'
  | 'LAST_12_HOURS'
  | 'TODAY'
  | 'YESTERDAY'
  | 'LAST_24_HOURS'
  | 'LAST_48_HOURS'
  | 'LAST_3_DAYS'
  | 'LAST_7_DAYS'
  | 'LAST_14_DAYS'
  | 'LAST_30_DAYS'
  | 'LAST_90_DAYS'
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'QUARTER_TO_DATE'
  | 'YEAR_TO_DATE';

// Centralised options list for n8n UI fields that use date-time presets
export const dateTimePresetOptions: Array<{ name: string; value: DateRangePreset }> = [
  { name: 'Last 5 minutes', value: 'LAST_5_MINUTES' },
  { name: 'Last 15 minutes', value: 'LAST_15_MINUTES' },
  { name: 'Last 30 minutes', value: 'LAST_30_MINUTES' },
  { name: 'Last 1 hour', value: 'LAST_1_HOUR' },
  { name: 'Last 2 hours', value: 'LAST_2_HOURS' },
  { name: 'Last 4 hours', value: 'LAST_4_HOURS' },
  { name: 'Last 6 hours', value: 'LAST_6_HOURS' },
  { name: 'Last 12 hours', value: 'LAST_12_HOURS' },
  { name: 'Last 24 hours', value: 'LAST_24_HOURS' },
  { name: 'Last 48 hours', value: 'LAST_48_HOURS' },
  { name: 'Last 3 days', value: 'LAST_3_DAYS' },
  { name: 'Last 7 days', value: 'LAST_7_DAYS' },
  { name: 'Last 14 days', value: 'LAST_14_DAYS' },
  { name: 'Last 30 days', value: 'LAST_30_DAYS' },
  { name: 'This week (to now)', value: 'THIS_WEEK' },
  { name: 'Today', value: 'TODAY' },
  { name: 'Yesterday', value: 'YESTERDAY' },
  { name: 'This month (to now)', value: 'THIS_MONTH' },
  { name: 'Last month', value: 'LAST_MONTH' },
  { name: 'Quarter to date', value: 'QUARTER_TO_DATE' },
  { name: 'Year to date', value: 'YEAR_TO_DATE' },
];

function pad(num: number, width = 2): string {
  const s = String(num);
  return s.length >= width ? s : '0'.repeat(width - s.length) + s;
}

export function formatIsoDateTimeUtc(date: Date): string {
  // YYYY-MM-DDTHH:mm:ss.SSSZ in UTC
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}.${pad(date.getUTCMilliseconds(), 3)}Z`;
}

export function formatDateUtc(date: Date): string {
  // YYYY-MM-DD in UTC
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function startOfDayUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

function endOfDayUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

function startOfWeekUtcMonday(date: Date): Date {
  const d = startOfDayUtc(date);
  const day = d.getUTCDay(); // 0=Sun,1=Mon,...
  const diff = day === 0 ? 6 : day - 1; // days since Monday
  d.setUTCDate(d.getUTCDate() - diff);
  return d;
}

function startOfMonthUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
}

function endOfMonthUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999));
}

function startOfQuarterUtc(date: Date): Date {
  const month = date.getUTCMonth();
  const qStartMonth = month - (month % 3);
  return new Date(Date.UTC(date.getUTCFullYear(), qStartMonth, 1, 0, 0, 0, 0));
}

export function computeDateTimeRangeUtc(preset: DateRangePreset): { from: string; to: string } {
  const now = new Date();
  let from: Date;
  let to: Date;

  switch (preset) {
    case 'LAST_5_MINUTES':
      from = new Date(now.getTime() - 5 * 60 * 1000);
      to = now;
      break;
    case 'LAST_15_MINUTES':
      from = new Date(now.getTime() - 15 * 60 * 1000);
      to = now;
      break;
    case 'LAST_30_MINUTES':
      from = new Date(now.getTime() - 30 * 60 * 1000);
      to = now;
      break;
    case 'LAST_1_HOUR':
      from = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      to = now;
      break;
    case 'LAST_2_HOURS':
      from = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      to = now;
      break;
    case 'LAST_4_HOURS':
      from = new Date(now.getTime() - 4 * 60 * 60 * 1000);
      to = now;
      break;
    case 'LAST_6_HOURS':
      from = new Date(now.getTime() - 6 * 60 * 60 * 1000);
      to = now;
      break;
    case 'LAST_12_HOURS':
      from = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      to = now;
      break;
    case 'TODAY':
      from = startOfDayUtc(now);
      to = endOfDayUtc(now);
      break;
    case 'YESTERDAY': {
      const y = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
      from = startOfDayUtc(y);
      to = endOfDayUtc(y);
      break;
    }
    case 'LAST_24_HOURS':
      from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      to = now;
      break;
    case 'LAST_48_HOURS':
      from = new Date(now.getTime() - 48 * 60 * 60 * 1000);
      to = now;
      break;
    case 'LAST_3_DAYS':
      from = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      to = now;
      break;
    case 'LAST_7_DAYS':
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      to = now;
      break;
    case 'LAST_14_DAYS':
      from = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      to = now;
      break;
    case 'LAST_30_DAYS':
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      to = now;
      break;
    case 'LAST_90_DAYS':
      from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      to = now;
      break;
    case 'THIS_WEEK':
      from = startOfWeekUtcMonday(now);
      to = now;
      break;
    case 'THIS_MONTH':
      from = startOfMonthUtc(now);
      to = now;
      break;
    case 'LAST_MONTH': {
      const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
      from = startOfMonthUtc(lastMonth);
      to = endOfMonthUtc(lastMonth);
      break;
    }
    case 'QUARTER_TO_DATE':
      from = startOfQuarterUtc(now);
      to = now;
      break;
    case 'YEAR_TO_DATE':
      from = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
      to = now;
      break;
    default:
      from = now;
      to = now;
  }

  return { from: formatIsoDateTimeUtc(from), to: formatIsoDateTimeUtc(to) };
}

export function computeDateRangeUtc(preset: DateRangePreset): { from: string; to: string } {
  const dt = computeDateTimeRangeUtc(preset);
  return { from: dt.from.slice(0, 10), to: dt.to.slice(0, 10) };
}

// Helpers for single "after" fields where only a lower bound is supported
export function computeAfterDateTimeUtc(preset: DateRangePreset): string {
  return computeDateTimeRangeUtc(preset).from;
}

export function computeAfterDateUtc(preset: DateRangePreset): string {
  return computeDateRangeUtc(preset).from;
}

// Helpers for single "before" fields where only an upper bound is supported
export function computeBeforeDateTimeUtc(preset: DateRangePreset): string {
  return computeDateTimeRangeUtc(preset).to;
}

export function computeBeforeDateUtc(preset: DateRangePreset): string {
  return computeDateRangeUtc(preset).to;
}


// Non-ISO helpers for endpoints that expect no timezone and no milliseconds
function isoToNoTz(iso: string): string {
  // Convert 'YYYY-MM-DDTHH:mm:ss.SSSZ' → 'YYYY-MM-DD HH:mm:ss'
  return iso.slice(0, 19).replace('T', ' ');
}

export function computeDateTimeRangeNoTzUtc(preset: DateRangePreset): { from: string; to: string } {
  const { from, to } = computeDateTimeRangeUtc(preset);
  return { from: isoToNoTz(from), to: isoToNoTz(to) };
}

