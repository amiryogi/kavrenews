/**
 * Nepali Date Converter Utility
 * Converts Gregorian dates to Nepali Bikram Sambat
 */

const nepaliMonths = [
  'बैशाख', 'जेष्ठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन',
  'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
];

const nepaliDays = [
  'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार',
  'बिहीबार', 'शुक्रबार', 'शनिबार'
];

const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Convert a number to Nepali numerals
 * @param {number} num - The number to convert
 * @returns {string} - Number in Nepali numerals
 */
export const toNepaliNumber = (num) => {
  return String(num)
    .split('')
    .map((digit) => {
      if (digit === '-' || digit === '.') return digit;
      return nepaliNumbers[parseInt(digit)] || digit;
    })
    .join('');
};

/**
 * Get relative time in Nepali
 * @param {Date} date - The date to convert
 * @returns {string} - Relative time in Nepali
 */
export const getRelativeTimeNepali = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'भर्खरै';
  if (minutes < 60) return `${toNepaliNumber(minutes)} मिनेट अघि`;
  if (hours < 24) return `${toNepaliNumber(hours)} घण्टा अघि`;
  if (days < 7) return `${toNepaliNumber(days)} दिन अघि`;
  if (weeks < 4) return `${toNepaliNumber(weeks)} हप्ता अघि`;
  if (months < 12) return `${toNepaliNumber(months)} महिना अघि`;
  return `${toNepaliNumber(years)} वर्ष अघि`;
};

/**
 * Get day name in Nepali
 * @param {Date} date - The date
 * @returns {string} - Day name in Nepali
 */
export const getNepaliDayName = (date) => {
  return nepaliDays[new Date(date).getDay()];
};

/**
 * Format date in Nepali style
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatNepaliDate = (date) => {
  const d = new Date(date);
  const day = toNepaliNumber(d.getDate());
  const month = d.toLocaleString('ne-NP', { month: 'long' });
  const year = toNepaliNumber(d.getFullYear());
  
  return `${day} ${month}, ${year}`;
};

export { nepaliMonths, nepaliDays, nepaliNumbers };
