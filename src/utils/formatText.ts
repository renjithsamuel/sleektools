import dayjs from 'dayjs';

export class FormatTextUtil {
  public static formatTicketText = (text: string): string => {
    if (typeof text !== 'string') {
      return text;
    }
    text = text.replace(/_/g, ' ');
    const words = text.split(' ');

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    text = words.join(' ');

    return text;
  };

  public static formatFirstWord = (text: string): string => {
    if (typeof text !== 'string' || text?.length === 0) {
      return text;
    }
    const words = text?.split(' ');
    if (words?.length > 0) {
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }

    return words.join(' ');
  };

  public static sliceText = (text: string): string => {
    if (typeof text !== 'string' || text?.length === 0) {
      return text;
    }
    const words = text.split(' ');
    return words?.slice(0, 8).join(' ') + '.';
  };

  public static formatNumberToK = (number: number): string => {
    if (typeof number !== 'number' || number <= 499) {
      return String(number);
    } else if (number >= 500 && number < 1000000) {
      const formattedNumber = (number / 1000).toFixed(1);
      return `${formattedNumber}k`;
    } else {
      return `${(number / 1000000).toFixed(1)}M`;
    }
  };

  public static formatDate = (date: Date): string => {
    if (!date || new Date(date).toISOString() === '0001-01-01T00:00:00.000Z') {
      return 'nil';
    }
    return dayjs(date).format('D MMMM, YYYY').toString();
  };

  public static removeExtraDots = (text: string): string => {
    if (typeof text !== 'string') {
      return text;
    }
    // Replace sequences of 4 or more dots (with optional spaces between) with empty string
    return text.replace(/(\.\s*){4,}/g, '');
  };
}
