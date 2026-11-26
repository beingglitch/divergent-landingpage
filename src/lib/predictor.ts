/* The college predictor (app/college-predictor, components/CollegePredictor).

   A student picks their exam and category and types their rank in that
   category's list. Every college whose closing rank they are near then falls
   into a band (BANDS below): likely, borderline or reach. A closing rank is
   the last rank admitted in the final round of last year's counselling, one
   number per category.

   THE CLOSING RANKS IN THIS FILE ARE MADE UP. They only look plausible so the
   page can be previewed. While PREDICTOR_SAMPLE is true the page says so in a
   banner and stays out of search, and the home page shows the predictor card
   as Coming soon. To go live: replace every row in the three tables below
   with the real closing ranks (CLOSING_FROM says which year and round), then
   set PREDICTOR_SAMPLE to false. */
export const PREDICTOR_SAMPLE = true;

/** Which counselling the closing ranks come from: the last round of the most
 *  recent year, since that is the real last rank admitted. */
export const CLOSING_FROM = { year: 2026, round: "final round" } as const;

export type PredictorExam = "UCEED" | "NID" | "NIFT";
export const EXAMS: PredictorExam[] = ["UCEED", "NID", "NIFT"];

export type Category = "GEN" | "GEN-EWS" | "OBC-NCL" | "SC" | "ST" | "PwD";

/** The categories, in the same order as the rank columns in the tables. */
export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "GEN", label: "General" },
  { key: "GEN-EWS", label: "EWS" },
  { key: "OBC-NCL", label: "OBC-NCL" },
  { key: "SC", label: "SC" },
  { key: "ST", label: "ST" },
  { key: "PwD", label: "PwD" },
];

export type Course = "B.Des" | "B.FTech";
/** UCEED and NID rows are all B.Des; NIFT has both. */
export const NIFT_COURSES: Course[] = ["B.Des", "B.FTech"];

export type Seat = {
  id: string;
  exam: PredictorExam;
  college: string;
  place: string;
  /** The campus photo: public/assets/img/campus/<photo>.webp */
  photo: string;
  course: Course;
  /** Closing rank per category; a category with no seat there is left out. */
  closing: Partial<Record<Category, number>>;
};

/* ==========================================================================
   THE CLOSING RANK TABLES (sample numbers: replace them all)

   One row per college and course:
     [photo, college, place, course, [GEN, GEN-EWS, OBC-NCL, SC, ST, PwD]]

   - photo: the file name in public/assets/img/campus, without ".webp".
   - Each number is the closing rank in that category's own rank list (for
     General that is the All India Rank), from the final round of the 2026
     counselling. PwD is the General PwD list.
   - Write null where a category has no seat at that college; the college
     then never shows for that category.
   - Add or remove rows to match the real seat matrix: a NIFT campus that
     does not run B.FTech should have no B.FTech row.
   ========================================================================== */
type Ranks = [gen: number | null, ews: number | null, obc: number | null, sc: number | null, st: number | null, pwd: number | null];
type Row = [photo: string, college: string, place: string, course: Course, ranks: Ranks];

const UCEED_ROWS: Row[] = [
  // photo              college              place          course      GEN   EWS   OBC   SC   ST  PwD
  ["iit-bombay",       "IIT Bombay",        "Mumbai",      "B.Des", [   64,   14,   33,  17,   6,   2]],
  ["iit-delhi",        "IIT Delhi",         "New Delhi",   "B.Des", [  118,   24,   58,  30,  11,   4]],
  ["iit-hyderabad",    "IIT Hyderabad",     "Hyderabad",   "B.Des", [  205,   41,   98,  51,  19,   7]],
  ["iit-guwahati",     "IIT Guwahati",      "Guwahati",    "B.Des", [  262,   52,  121,  64,  24,   9]],
  ["iit-roorkee",      "IIT Roorkee",       "Roorkee",     "B.Des", [  338,   66,  152,  80,  31,  11]],
  ["iit-indore",       "IIT Indore",        "Indore",      "B.Des", [  455,   88,  196, 104,  40,  14]],
  ["iiitdm-jabalpur",  "IIITDM Jabalpur",   "Jabalpur",    "B.Des", [  610,  118,  260, 140,  52,  18]],
];

const NID_ROWS: Row[] = [
  // photo                college                 place              course      GEN   EWS   OBC   SC   ST  PwD
  ["nid-ahmedabad",      "NID Ahmedabad",        "Ahmedabad",       "B.Des", [  142,   30,   70,  36,  14,   4]],
  ["nid-kurukshetra",    "NID Haryana",          "Kurukshetra",     "B.Des", [  468,   95,  214, 110,  42,  12]],
  ["nid-andhra-pradesh", "NID Andhra Pradesh",   "Amaravati",       "B.Des", [  512,  104,  238, 122,  46,  13]],
  ["nid-madhya-pradesh", "NID Madhya Pradesh",   "Bhopal",          "B.Des", [  540,  110,  250, 128,  49,  14]],
  ["nid-assam",          "NID Assam",            "Jorhat",          "B.Des", [  618,  125,  286, 146,  56,  16]],
];

const NIFT_ROWS: Row[] = [
  // photo             college             place          course        GEN   EWS   OBC   SC   ST  PwD
  ["nift-delhi",       "NIFT New Delhi",   "New Delhi",   "B.Des",   [  180,   38,   86,  44,  18,   5]],
  ["nift-mumbai",      "NIFT Mumbai",      "Mumbai",      "B.Des",   [  320,   66,  150,  76,  30,   8]],
  ["nift-bangalore",   "NIFT Bengaluru",   "Bengaluru",   "B.Des",   [  360,   74,  168,  86,  33,   9]],
  ["nift-hyderabad",   "NIFT Hyderabad",   "Hyderabad",   "B.Des",   [  520,  106,  240, 124,  47,  12]],
  ["nift-chennai",     "NIFT Chennai",     "Chennai",     "B.Des",   [  560,  114,  258, 132,  50,  13]],
  ["nift-gandhinagar", "NIFT Gandhinagar", "Gandhinagar", "B.Des",   [  640,  130,  292, 150,  57,  15]],
  ["nift-kolkata",     "NIFT Kolkata",     "Kolkata",     "B.Des",   [  720,  146,  330, 168,  64,  17]],
  ["nift-jodhpur",     "NIFT Jodhpur",     "Jodhpur",     "B.Des",   [ 1350,  270,  610, 310, 118,  30]],
  ["nift-bhopal",      "NIFT Bhopal",      "Bhopal",      "B.Des",   [ 1500,  300,  680, 345, 130,  33]],
  ["nift-raebareli",   "NIFT Raebareli",   "Raebareli",   "B.Des",   [ 1700,  340,  770, 390, 148,  37]],
  ["nift-kannur",      "NIFT Kannur",      "Kannur",      "B.Des",   [ 1850,  370,  840, 425, 160,  40]],
  ["nift-patna",       "NIFT Patna",       "Patna",       "B.Des",   [ 2000,  400,  905, 460, 174,  43]],
  ["nift-panchkula",   "NIFT Panchkula",   "Panchkula",   "B.Des",   [ 2150,  430,  975, 495, 186,  46]],
  ["nift-kangra",      "NIFT Kangra",      "Kangra",      "B.Des",   [ 2400,  480, 1090, 550, 208,  52]],
  ["nift-shillong",    "NIFT Shillong",    "Shillong",    "B.Des",   [ 2700,  540, 1220, 620, 234,  58]],
  ["nift-srinagar",    "NIFT Srinagar",    "Srinagar",    "B.Des",   [ 3000,  600, 1360, 690, 260,  64]],
  ["nift-delhi",       "NIFT New Delhi",   "New Delhi",   "B.FTech", [  260,   52,  118,  60,  23,   6]],
  ["nift-mumbai",      "NIFT Mumbai",      "Mumbai",      "B.FTech", [  420,   84,  190,  97,  37,   9]],
  ["nift-bangalore",   "NIFT Bengaluru",   "Bengaluru",   "B.FTech", [  450,   90,  204, 104,  40,  10]],
  ["nift-hyderabad",   "NIFT Hyderabad",   "Hyderabad",   "B.FTech", [  620,  124,  280, 143,  54,  13]],
  ["nift-chennai",     "NIFT Chennai",     "Chennai",     "B.FTech", [  660,  132,  298, 152,  58,  14]],
  ["nift-gandhinagar", "NIFT Gandhinagar", "Gandhinagar", "B.FTech", [  720,  144,  326, 166,  63,  16]],
  ["nift-kolkata",     "NIFT Kolkata",     "Kolkata",     "B.FTech", [  800,  160,  362, 184,  70,  17]],
  ["nift-jodhpur",     "NIFT Jodhpur",     "Jodhpur",     "B.FTech", [ 1100,  220,  498, 253,  96,  24]],
  ["nift-bhopal",      "NIFT Bhopal",      "Bhopal",      "B.FTech", [ 1200,  240,  543, 276, 105,  26]],
  ["nift-kannur",      "NIFT Kannur",      "Kannur",      "B.FTech", [ 1300,  260,  588, 299, 113,  28]],
  ["nift-patna",       "NIFT Patna",       "Patna",       "B.FTech", [ 1400,  280,  634, 322, 122,  30]],
  ["nift-kangra",      "NIFT Kangra",      "Kangra",      "B.FTech", [ 1600,  320,  724, 368, 140,  35]],
];

function toSeats(exam: PredictorExam, rows: Row[]): Seat[] {
  return rows.map(([photo, college, place, course, ranks]) => {
    const closing: Partial<Record<Category, number>> = {};
    CATEGORIES.forEach((c, i) => {
      const r = ranks[i];
      if (r != null && r > 0) closing[c.key] = r;
    });
    return { id: `${exam}-${photo}-${course}`.toLowerCase().replace(/\./g, ""), exam, college, place, photo, course, closing };
  });
}

export const SEATS: Seat[] = [...toSeats("UCEED", UCEED_ROWS), ...toSeats("NID", NID_ROWS), ...toSeats("NIFT", NIFT_ROWS)];

/** How many different colleges each exam covers (a NIFT campus counts once
 *  for both courses), for the facts on the page. */
export function collegeCount(exam: PredictorExam): number {
  return new Set(SEATS.filter((s) => s.exam === exam).map((s) => s.college)).size;
}

/* ==========================================================================
   THE BANDS
   ratio = your rank / the closing rank, so below 1 means inside last year's
   cut. Each band takes the ratios up to its `max`; past the last band a
   college only adds to the "out of reach" count. The page's meter runs from
   0 to METER_MAX, with the closing rank at 1.
   ========================================================================== */
export type Band = "likely" | "borderline" | "reach";

export const BANDS: { key: Band; label: string; line: string; max: number }[] = [
  { key: "likely", label: "Likely", line: "Well inside last year’s closing rank.", max: 0.8 },
  { key: "borderline", label: "Borderline", line: "Close to the closing rank. Could go either way.", max: 1.1 },
  { key: "reach", label: "Reach", line: "Past it, but closing ranks move every year.", max: 1.5 },
];

export const METER_MAX = BANDS[BANDS.length - 1].max;

export type Match = { seat: Seat; closing: number; ratio: number; band: Band };

export type Prediction = { bands: Record<Band, Match[]>; beyond: number };

export function bandOf(ratio: number): Band | null {
  return BANDS.find((b) => ratio <= b.max)?.key ?? null;
}

/** Every college for this exam, category and course, sorted into bands. Each
 *  band lists the hardest to get first, so the best college in reach leads. */
export function predict(exam: PredictorExam, category: Category, rank: number, course: Course): Prediction {
  const want: Course = exam === "NIFT" ? course : "B.Des";
  const bands: Record<Band, Match[]> = { likely: [], borderline: [], reach: [] };
  let beyond = 0;
  for (const seat of SEATS) {
    if (seat.exam !== exam || seat.course !== want) continue;
    const closing = seat.closing[category];
    if (!closing) continue;
    const ratio = rank / closing;
    const band = bandOf(ratio);
    if (band) bands[band].push({ seat, closing, ratio, band });
    else beyond += 1;
  }
  for (const list of Object.values(bands)) list.sort((a, b) => a.closing - b.closing);
  return { bands, beyond };
}
