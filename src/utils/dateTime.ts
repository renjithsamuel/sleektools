import dayjs from 'dayjs';
import AdvancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(AdvancedFormat);

export class DateTimeUtil {
  public static getShortDate = (date: string | Date): string => {
    return dayjs(date).format('DD/MM/YYYY');
  };

  public static getLongDate = (date: string | Date): string => {
    return dayjs(date).format('Do MMMM, YYYY (dddd)');
  };

  public static getLongDateWithoutDay = (date: string | Date): string => {
    return dayjs(date).format('Do MMMM, YYYY');
  };

  public static getDaysDiff(date: string | Date): number {
    const dateObj = dayjs(date).startOf('day');
    const today = dayjs().startOf('day');
    const diff = dateObj.diff(today, 'day');
    return diff;
  }

  public static getPreviousDate(date: string | Date, diff: number): Date {
    const dateObj = dayjs(date).startOf('day');
    const previousDate = dateObj.subtract(diff, 'day').toDate();
    return previousDate;
  }

  public static getTimeFromDate = (date: string | Date): string => {
    const dateObj = dayjs(date);
    const hours = dateObj.format('HH');
    const minutes = dateObj.format('mm');

    return `${hours}:${minutes}`;
  };
}
