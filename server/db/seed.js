import { db } from './index.js';
import { v4 as uuid } from 'uuid';

const now = () => new Date().toISOString();

const starters = [
  { text: "My cat unplugged the router right as I was about to submit it.", category: "work", severity: 2 },
  { text: "I had to attend my grandmother's funeral. Again.", category: "work", severity: 4 },
  { text: "Sorry, I was stuck in an elevator with a mime. He wouldn't tell anyone.", category: "work", severity: 5 },
  { text: "Traffic was insane — there was a parade I didn't know about.", category: "work", severity: 1 },
  { text: "My dog ate my homework. Literally. I have the X-ray.", category: "school", severity: 3 },
  { text: "I left my laptop on the bus and the bus is now in another country.", category: "school", severity: 4 },
  { text: "My printer achieved sentience and refused to print my essay.", category: "school", severity: 5 },
  { text: "I thought the assignment was due next week. My bad.", category: "school", severity: 1 },
  { text: "Can't make it tonight — I'm washing my hair. It's a whole thing.", category: "social", severity: 2 },
  { text: "I'd love to, but I committed to reorganizing my sock drawer tonight.", category: "social", severity: 3 },
  { text: "Sorry, I'm allergic to fun on Tuesdays.", category: "social", severity: 5 },
  { text: "I have a headache that started 3 weeks ago and we just don't know.", category: "social", severity: 3 },
  { text: "My aunt is visiting and she only speaks in interpretive dance.", category: "family", severity: 4 },
  { text: "I have to babysit my brother's pet rock. It's a big responsibility.", category: "family", severity: 5 },
  { text: "Family emergency — the toaster broke and morale is low.", category: "family", severity: 2 },
  { text: "I promised my mom I'd help her debug her Facebook.", category: "family", severity: 2 },
  { text: "Mercury is in retrograde and I'm respecting the vibes.", category: "other", severity: 4 },
  { text: "I'm participating in a silent retreat that started 5 minutes ago.", category: "other", severity: 5 },
  { text: "My alarm clock and I are not on speaking terms.", category: "other", severity: 2 },
  { text: "I was abducted by aliens. They were nice though, gave me snacks.", category: "other", severity: 5 }
];

db.data.excuses = starters.map(s => ({
  id: uuid(),
  text: s.text,
  category: s.category,
  severity: s.severity,
  timesUsed: 0,
  createdAt: now(),
  updatedAt: now()
}));

await db.write();
console.log(`Seeded ${db.data.excuses.length} excuses.`);
