import type { House, HouseId, Seat } from "./types";

const CTAP: House = {
  id: "community-tap",
  name: "Community Tap & Pizza",
  aka: ["CTAP", "Community Pizza"],
  city: "Fort Dodge, IA",
  icp: "Owner 1–5 · paper spine",
  statusLine: "Live lab. Myke / Kenzy / Tom seats sold.",
  fridayReady: false,
  seats: [
    {
      loginId: "myke",
      name: "Mychael Mueller",
      role: "owner",
      label: "Owner seat",
      emails: ["myke@n86.app", "mykemueller1@gmail.com"],
      owns: ["prime cost", "approve the card", "3P"],
      status: "sold",
    },
    {
      loginId: "kenzy",
      name: "Kenzy Thompson",
      role: "manager_foh",
      label: "Manager FOH",
      emails: ["kenzy"],
      owns: ["beer", "liquor", "FOH labor"],
      status: "sold",
    },
    {
      loginId: "tom",
      name: "Tom Dorothy",
      role: "manager_boh",
      label: "Manager BOH",
      emails: ["tom", "thomasdorothy4873@gmail.com"],
      owns: ["food vendors", "kitchen labor"],
      status: "sold",
    },
  ],
  findings: [
    {
      id: "ctap-oil",
      kind: "prices",
      title: "Olive oil moved 15.8%",
      dollars: "$10.80 / case",
      move: "Verify pack size, then ask the vendor to explain the increase before the next order.",
      receipt: "Two invoice periods · same vendor · same SKU · $68.40 → $79.20",
      source: "Invoice OCR · Community Tap AP spine",
      severity: "now",
    },
    {
      id: "ctap-labor",
      kind: "payroll",
      title: "Punch ≠ labor card",
      dollars: "Daily drift",
      move: "Photo the week. Name the roles. Compare each card to the clock before payroll leaves.",
      receipt: "Kitchen labor cards AM/PM × Pizza 1–3, Fry, Oven, Drivers",
      source: "Paper labor cards · Fort Dodge",
      severity: "watch",
    },
    {
      id: "ctap-pasta",
      kind: "prices",
      title: "Pasta sitting under the room",
      dollars: "~$29K / yr left",
      move: "Reprice pasta against the $20–22 full-service field. Keep the receipt next to the plate.",
      receipt: "Market check vs Applebee's $20–22 · house pasta $14.45",
      source: "June 2026 market pack · Community Tap",
      severity: "watch",
    },
    {
      id: "ctap-close",
      kind: "process",
      title: "Close still lives in the owner's head",
      dollars: "One next move",
      move: "Kenzy runs FOH close. Tom runs BOH close. Myke only approves exceptions.",
      receipt: "Sold seats Fri 2026-09-04 · live book through Sat 9/6",
      source: "CTAP seat book",
      severity: "now",
    },
  ],
  evidence: [
    {
      name: "Weekly invoice photo pack Aug 2026",
      kind: "invoice photos",
      when: "2026-08",
      note: "Hy-Vee / Hopkins / Fort Dodge slips · OCR batch staged",
    },
    {
      name: "Kitchen labor cards",
      kind: "payroll paper",
      when: "live week",
      note: "AM/PM station cards",
    },
  ],
};

const GRILL: House = {
  id: "grill",
  name: "The New American Grill",
  aka: ["Max's Grill", "American Griller", "NAG", "the grill"],
  city: "Single-unit · Toast house",
  icp: "Owner 1–5 · digital Toast",
  statusLine: "Friday seat. Kristen Courser packs loaded. Max tries the desk.",
  fridayReady: true,
  seats: [
    {
      loginId: "max",
      name: "Max",
      role: "owner",
      label: "Owner seat",
      emails: ["max", "max@grill", "max@newamericangrill"],
      owns: ["prime cost", "labor %", "SPLH", "approve the card"],
      status: "ready",
      friday: true,
    },
    {
      loginId: "kristen",
      name: "Kristen Aduna",
      role: "analyst",
      label: "Kristen · Courser load",
      emails: ["kristen", "kristin", "kristin aduna", "kristen@grill"],
      owns: ["Toast exports", "labor packs", "item mix"],
      status: "sold",
    },
  ],
  toastDay: {
    date: "2026-08-31",
    source: "LaborBreakDown + SalesSummary xlsx · Kristen Courser",
    net: 3408.15,
    gross: 3570.5,
    laborCost: 1211.85,
    laborPct: 35.56,
    splh: 35.17,
    guests: 119,
    orders: 65,
    avgGuest: 28.64,
    tips: 560.38,
    discounts: 162.35,
    voids: 31,
    voidOrders: 2,
  },
  toastWeek: {
    range: "2026-08-24 → 2026-08-30",
    source: "ItemSelectionDetails_2026_08_24-2026_08_30.csv",
    note: "Labor day (8/31) and sales week (8/24–8/30) are different windows. Do not blend them into one fake prime cost.",
    net: 36827.34,
    units: 2770,
    skuCount: 234,
    food: 29274.84,
    liquor: 7532.5,
    mix: [
      { sku: "Burger", group: "Burgers", menu: "Dinner", category: "Food", qty: 118, net: 2208.4 },
      { sku: "Stir Fry", group: "Entrees", menu: "Dinner", category: "Food", qty: 47, net: 1036.8 },
      { sku: "Fish & Chips", group: "Entrees", menu: "Dinner", category: "Food", qty: 42, net: 989.2 },
      { sku: "Green Curry", group: "Entrees", menu: "Dinner", category: "Food", qty: 36, net: 855 },
      { sku: "Burger (Lunch)", group: "Burgers", menu: "Lunch", category: "Food", qty: 42, net: 716.45 },
      { sku: "Lemon Chicken", group: "Entrees", menu: "Dinner", category: "Food", qty: 34, net: 702.7 },
      { sku: "Grilled Chicken Sandwich", group: "Burgers", menu: "Dinner", category: "Food", qty: 41, net: 685.5 },
      { sku: "Tzatziki Salmon", group: "Entrees", menu: "Dinner", category: "Food", qty: 24, net: 624 },
      { sku: "Wings", group: "Appetizers", menu: "Dinner", category: "Food", qty: 36, net: 600.1 },
      { sku: "Green State Lager", group: "Draft", menu: "Beer", category: "Liquor", qty: 65, net: 585 },
      { sku: "Bolognese", group: "Featured Menu", menu: "Dinner", category: "Food", qty: 27, net: 560.25 },
      { sku: "Burrito", group: "Entrees", menu: "Dinner", category: "Food", qty: 27, net: 530 },
    ],
  },
  hours: [
    { hour: 11, net: 80.1, orders: 3, guests: 5 },
    { hour: 12, net: 250, orders: 5, guests: 11 },
    { hour: 13, net: 132, orders: 2, guests: 7 },
    { hour: 14, net: 170, orders: 4, guests: 7 },
    { hour: 15, net: 160.8, orders: 5, guests: 8 },
    { hour: 16, net: 184.4, orders: 6, guests: 10 },
    { hour: 17, net: 695, orders: 12, guests: 21 },
    { hour: 18, net: 1302.9, orders: 19, guests: 36 },
    { hour: 19, net: 286.4, orders: 5, guests: 9 },
    { hour: 20, net: 146.55, orders: 4, guests: 5 },
  ],
  dayparts: [
    { name: "Lunch", net: 792.9, orders: 19 },
    { name: "Dinner", net: 2615.25, orders: 46 },
  ],
  jobs: [
    { job: "Cook", hours: 45.23, cost: 750.84, people: 5 },
    { job: "PM Bartender", hours: 17.2, cost: 205.59, people: 2 },
    { job: "Server", hours: 11.43, cost: 91.45, people: 2 },
    { job: "Chef", hours: 10.71, cost: 0, people: 1 },
    { job: "MAIN BAR", hours: 11.28, cost: 0, people: 1 },
    { job: "AM Server", hours: 5.5, cost: 44, people: 1 },
    { job: "Host", hours: 3.43, cost: 61.8, people: 1 },
    { job: "Expo", hours: 3.42, cost: 58.16, people: 1 },
  ],
  findings: [
    {
      id: "grill-labor",
      kind: "payroll",
      title: "Labor ran 35.56% of net",
      dollars: "$1,211.85 on $3,408.15",
      move: "Hold 30% as the floor target. That day was ~$189 heavy. Cook hours (45.2) are the pile — cut one mid shift before 4pm, keep the 5–7pm fire line.",
      receipt: "Toast Labor Breakdown 2026-08-31 · Kristen Courser · SPLH $35.17",
      source: "LaborBreakDown_2026-08-31_2026-08-31.xlsx",
      severity: "now",
    },
    {
      id: "grill-peak",
      kind: "toast",
      title: "6pm is the house",
      dollars: "$1,302.90 / 19 tickets",
      move: "Staff the 5–7 window like it is the whole day. Lunch is $793 / 19 tickets — do not match dinner headcount at 11.",
      receipt: "Sales Summary by hour · 2026-08-31 · 17:00 $695 · 18:00 $1,303 · 19:00 $286",
      source: "SalesSummary_2026-08-31_2026-08-31.xlsx",
      severity: "now",
    },
    {
      id: "grill-burger",
      kind: "prices",
      title: "Burger is the engine",
      dollars: "$2,208 dinner + $716 lunch",
      move: "Protect burger food cost first. 160 burgers in the week. If the patty or bun creeps, it hits harder than any featured plate.",
      receipt: "Item Selection 8/24–8/30 · Burger Dinner qty 118 · Lunch qty 42",
      source: "ItemSelectionDetails_2026_08_24-2026_08_30.csv",
      severity: "watch",
    },
    {
      id: "grill-discount",
      kind: "process",
      title: "Discounts took $162.35 in one day",
      dollars: "4.5% of net",
      move: "Name who comped. Bar discounted $100.75, dining $61.60. Ask for the reason code before the next Monday.",
      receipt: "Sales Summary 8/31 · Sales discounts −$162.35 · Bar $100.75 · Dining $61.60",
      source: "SalesSummary_2026-08-31_2026-08-31.xlsx",
      severity: "watch",
    },
    {
      id: "grill-voids",
      kind: "toast",
      title: "Voids were small and honest",
      dollars: "$31 · 2 items",
      move: "Keep voids on the desk. 0.9% is not the leak. Labor is.",
      receipt: "Void amount $31 · 2 orders · 2 items · 0.9%",
      source: "SalesSummary_2026-08-31_2026-08-31.xlsx",
      severity: "good",
    },
    {
      id: "grill-chef",
      kind: "payroll",
      title: "Chef hours show $0 cost",
      dollars: "10.71 hrs unpaid on the report",
      move: "Decide if Max/chef labor is supposed to sit in the 35.56% or outside it. Toast IQ hides this. We don't.",
      receipt: "Labor Breakdown · Chef 10.71 hrs · $0.00 · Time Entries 8/31",
      source: "LaborBreakDown + TimeEntries_2026_08_31.csv",
      severity: "watch",
    },
  ],
  evidence: [
    {
      name: "LaborBreakDown_2026-08-31_2026-08-31.xlsx",
      kind: "Toast labor",
      when: "2026-08-31",
      note: "Kristen · Courser · labor 35.56% · SPLH $35.17",
    },
    {
      name: "SalesSummary_2026-08-31_2026-08-31.xlsx",
      kind: "Toast sales",
      when: "2026-08-31",
      note: "Net $3,408.15 · 119 guests · dinner $2,615",
    },
    {
      name: "ItemSelectionDetails_2026_08_24-2026_08_30.csv",
      kind: "Toast mix",
      when: "2026-08-24–30",
      note: "234 SKUs · $36,827.34 · burger leads",
    },
    {
      name: "TimeEntries_2026_08_31.csv",
      kind: "Toast punches",
      when: "2026-08-31",
      note: "14 people · 108.2 payable hours in mix file (week/day mismatch flagged)",
    },
  ],
};

const HOUSES: Record<HouseId, House> = {
  "community-tap": CTAP,
  grill: GRILL,
};

export function listHouses(): House[] {
  return [GRILL, CTAP];
}

export function getHouse(id: HouseId | string | undefined): House | null {
  if (!id) return null;
  if (id === "community-tap" || id === "ctap" || id === "community-pizza") {
    return CTAP;
  }
  if (id === "grill" || id === "nag" || id === "max" || id === "american") {
    return GRILL;
  }
  return HOUSES[id as HouseId] ?? null;
}

export function findSeat(query: string): { house: House; seat: Seat } | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  for (const house of listHouses()) {
    for (const seat of house.seats) {
      const hay = [seat.loginId, seat.name, ...seat.emails].join(" ").toLowerCase();
      if (hay.includes(q) || q.includes(seat.loginId)) {
        return { house, seat };
      }
    }
  }
  return null;
}

export function money(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function pct(n: number): string {
  return `${n.toFixed(2)}%`;
}
