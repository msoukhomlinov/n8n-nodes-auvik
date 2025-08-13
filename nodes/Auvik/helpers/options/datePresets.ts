export type DateRangePreset =
  | 'TODAY'
  | 'YESTERDAY'
  | 'LAST_24_HOURS'
  | 'LAST_48_HOURS'
  | 'LAST_7_DAYS'
  | 'LAST_14_DAYS'
  | 'LAST_30_DAYS'
  | 'LAST_90_DAYS'
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'QUARTER_TO_DATE'
  | 'YEAR_TO_DATE';

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


