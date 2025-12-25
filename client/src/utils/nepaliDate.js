/**
 * Nepali Date (Bikram Sambat) Converter Utility
 * For converting AD dates to BS dates
 */

// BS calendar data (1970-2100)
const bsMonthData = {
  2070: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2072: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2073: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2074: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2075: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2077: [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
  2078: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2081: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2083: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2085: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2086: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2087: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2088: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
};

const nepaliMonths = [
  'बैशाख', 'जेष्ठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन',
  'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
];

const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Convert number to Nepali numerals
 */
export const toNepaliNumber = (num) => {
  return String(num)
    .split('')
    .map((digit) => (digit >= '0' && digit <= '9' ? nepaliNumbers[parseInt(digit)] : digit))
    .join('');
};

/**
 * Convert AD date to BS date (approximate)
 * Uses a reference point: 2025-12-25 AD = 2082-09-10 BS
 */
export const adToBs = (adDate) => {
  const ad = new Date(adDate);
  
  // Reference: 2025-12-25 AD = 2082-09-10 BS (Poush 10)
  const refAd = new Date(2025, 11, 25); // Month is 0-indexed (11 = Dec)
  const refBs = { year: 2082, month: 9, day: 10 };
  
  // Calculate difference in days
  const oneDay = 1000 * 60 * 60 * 24;
  let daysDiff = Math.floor((ad - refAd) / oneDay);
  
  let bsYear = refBs.year;
  let bsMonth = refBs.month;
  let bsDay = refBs.day;
  
  // Forward calculation (future dates)
  if (daysDiff >= 0) {
    while (daysDiff > 0) {
      const daysInMonth = (bsMonthData[bsYear] && bsMonthData[bsYear][bsMonth - 1]) || 30;
      const remainingDaysInMonth = daysInMonth - bsDay;
      
      if (daysDiff <= remainingDaysInMonth) {
        bsDay += daysDiff;
        daysDiff = 0;
      } else {
        daysDiff -= (remainingDaysInMonth + 1);
        bsDay = 1;
        bsMonth++;
        
        if (bsMonth > 12) {
          bsMonth = 1;
          bsYear++;
        }
      }
    }
  } else {
    // Backward calculation (past dates)
    daysDiff = Math.abs(daysDiff);
    while (daysDiff > 0) {
      if (daysDiff < bsDay) {
        bsDay -= daysDiff;
        daysDiff = 0;
      } else {
        daysDiff -= bsDay; // Go to 0 (last day of prev month)
        // Move to previous month
        bsMonth--;
        if (bsMonth < 1) {
          bsMonth = 12;
          bsYear--;
        }
        // Set day to last day of that month
        const daysInMonth = (bsMonthData[bsYear] && bsMonthData[bsYear][bsMonth - 1]) || 30;
        bsDay = daysInMonth;
      }
    }
  }
  
  return { year: bsYear, month: bsMonth, day: bsDay };
};

/**
 * Format date in both AD and BS
 */
export const formatDateBilingual = (dateString) => {
  if (!dateString) return '';
  
  const adDate = new Date(dateString);
  const bsDate = adToBs(adDate);
  
  // Format AD
  const adFormatted = adDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Format BS in Nepali
  const bsFormatted = `${toNepaliNumber(bsDate.day)} ${nepaliMonths[bsDate.month - 1]}, ${toNepaliNumber(bsDate.year)}`;
  
  return {
    ad: adFormatted,
    bs: bsFormatted,
    combined: `${bsFormatted} (${adFormatted})`,
  };
};

/**
 * Format date showing only BS in Nepali
 */
export const formatBsDate = (dateString) => {
  if (!dateString) return '';
  
  const bsDate = adToBs(new Date(dateString));
  return `${toNepaliNumber(bsDate.day)} ${nepaliMonths[bsDate.month - 1]}, ${toNepaliNumber(bsDate.year)}`;
};

/**
 * Get relative time in Nepali
 */
export const getRelativeTimeNepali = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (seconds < 60) return 'भर्खरै';
  if (minutes < 60) return `${toNepaliNumber(minutes)} मिनेट अघि`;
  if (hours < 24) return `${toNepaliNumber(hours)} घण्टा अघि`;
  if (days < 7) return `${toNepaliNumber(days)} दिन अघि`;
  if (weeks < 4) return `${toNepaliNumber(weeks)} हप्ता अघि`;
  if (months < 12) return `${toNepaliNumber(months)} महिना अघि`;
  
  // For older dates, show full BS date
  return formatBsDate(dateString);
};
