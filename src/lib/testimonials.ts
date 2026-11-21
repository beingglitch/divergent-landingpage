/* Video testimonials from past students. The results page shows all of
   them; the AIDMT page shows the ones that talk about our mocks (`mocks`). */
export type Story = {
  slug: string;
  name: string;
  /** Short name for the play button's label. */
  short: string;
  rank: string;
  quote: string;
  mocks?: boolean;
};

export const STORIES: Story[] = [
  { slug: "ruhaniyat", name: "Ruhaniyat", short: "Ruhaniyat", rank: "UCEED AIR 14", quote: "Divergent helped me improve Part B, and the mock tests helped me reduce mistakes.", mocks: true },
  { slug: "jacinth", name: "Jacinth Hussain Pegu", short: "Jacinth", rank: "UCEED AIR 5 (category)", quote: "The mock tests by Divergent are by far the best I came across.", mocks: true },
  { slug: "rohith", name: "Rohith Seetharaman", short: "Rohith", rank: "UCEED AIR 45", quote: "Divergent mock tests and sessions were very helpful in my preparation.", mocks: true },
  { slug: "megha", name: "Megha Mhetre", short: "Megha", rank: "UCEED AIR 60", quote: "The mocks were pretty helpful, and so were the free sketching and GK classes." },
  { slug: "atsi", name: "Atsi Lakhera", short: "Atsi", rank: "UCEED AIR 90", quote: "I joined 3 months before the exam. The exam-like mocks really helped.", mocks: true },
  { slug: "sharanya", name: "Kadapala Sharanya Reddy", short: "Sharanya", rank: "UCEED AIR 178", quote: "It quickly felt like a safe space to learn and grow." },
  { slug: "samruddha", name: "Samruddha Ghosh", short: "Samruddha", rank: "UCEED AIR 205", quote: "A very personalised experience. Classic padhai, along with fun sessions." },
  { slug: "ayushri", name: "Ayushri", short: "Ayushri", rank: "UCEED AIR 205 (category)", quote: "The mentors didn't just teach. They guided us at every step." },
];
