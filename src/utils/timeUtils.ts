'use client';
export class TimeUtil {
  public static getTimeDifference(time: Date | string): string {
    const timeInMillis = new Date(time).getTime();
    const nowInMillis = Date.now();
    const differenceInMillis = nowInMillis - timeInMillis;
    const daysDifference = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));
    const hoursDifference = Math.floor(differenceInMillis / (1000 * 60 * 60));
    const minutesDifference = Math.floor(differenceInMillis / (1000 * 60));

    if (daysDifference === 0) {
      if (hoursDifference === 0) {
        if (minutesDifference === 0) {
          return 'just now';
        }

        return `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
      }

      return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
    }

    return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
  }
}
