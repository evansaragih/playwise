/**
 * PlayWise Font System — extracted directly from Figma
 *
 * Space Grotesk (Bold):
 *   - All section headings (18px, 22px, 32px)
 *   - Screen titles (22px Bold)
 *   - Card titles / court names (22px Bold)
 *   - Sport tile labels (18px Bold)
 *   - CTA button text: "CONFIRM & PAY", "PAYMENT" (18px Bold)
 *   - Big numbers: streak count, spend amount, stats (32px Bold)
 *   - Schedule times: "10:00 - 12:00" (18px Bold)
 *   - Game entry pass title (30px Bold)
 *   - Chart highlighted bar label "May" (10px Bold)
 *
 * Space Grotesk (Regular):
 *   - Chart month labels: jan/feb/mar/apr (10px Regular)
 *
 * Lexend (SemiBold):
 *   - ALL badges / chips: "PENDING", "UPCOMING GAME", "CONFIRMED" (12px)
 *   - "View All" links (12px)
 *   - "DAYS ACTIVE" label (12px)
 *   - Button labels: "PAY NOW", "DETAILS", "VIEW PASS" (12px)
 *   - Rating values: "4.9" (12px)
 *   - "AVAILABLE" label (12px)
 *   - Available time value: "17:00" (16px)
 *   - Price values: "Rp 400,000", "Rp 1,600,000" (16px, 14px)
 *   - Section labels: "VENUE PRICE COMPARISON", "BOOKED SCHEDULE" (12px)
 *   - Filter chips: "All", "Padel" etc (12px)
 *   - Venue names in price list: "Padel City" (14px)
 *   - "CHOOSE PAYMENT METHOD" (12px)
 *
 * Lexend (Regular):
 *   - Venue names in cards: "SportHub Arena" (14px)
 *   - Sub-labels: "Schedule", "From", "/hr" (10px, 12px)
 *   - Trend text: "+Rp 537,900 from last month" (12px)
 *   - Date/meta: "16 Oct, 18:00 • Central Arena" (14px)
 *   - Subtitles: "Ready for your 2-minute booking?" (14px)
 *   - "Top rated spots in Madrid" (14px)
 *   - Location text: "Chamberí, Madrid • 1.2km" (14px)
 *   - Nav tab labels: "Home", "Discover" etc (12px)
 *   - Body copy / descriptions (14px)
 *   - Payment modes: "Pay In Full" (12px)
 *   - "4 venues found" (14px)
 *   - Section sub-labels (12px)
 *
 * Lexend (Medium):
 *   - Date section headers in My Games: "PENDING PAYMENT", "TODAY", "TOMORROW" (14px)
 *   - Calendar day labels: "Mon", "Tue" (10px)
 *
 * Lexend (Bold):
 *   - Selected date in calendar (10px)
 *   - Player names in payment (12px)
 */

export const font = {
  // Space Grotesk — headings, titles, large numbers, sport labels
  heading: '"Space Grotesk", sans-serif',
  // Lexend — all UI labels, chips, buttons, body copy, nav
  ui: '"Lexend", sans-serif',
} as const;
