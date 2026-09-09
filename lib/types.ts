export type HouseId = "community-tap" | "grill";

export type SeatRole = "owner" | "manager_foh" | "manager_boh" | "analyst";

export type FindingKind = "payroll" | "prices" | "process" | "toast";

export type Finding = {
  id: string;
  kind: FindingKind;
  title: string;
  dollars: string;
  move: string;
  receipt: string;
  source: string;
  severity: "now" | "watch" | "good";
};

export type MixRow = {
  sku: string;
  group: string;
  menu: string;
  category: string;
  qty: number;
  net: number;
};

export type HourRow = {
  hour: number;
  net: number;
  orders: number;
  guests: number;
};

export type Seat = {
  loginId: string;
  name: string;
  role: SeatRole;
  label: string;
  emails: string[];
  owns: string[];
  status: "sold" | "ready" | "available";
  friday?: boolean;
};

export type House = {
  id: HouseId;
  name: string;
  aka: string[];
  city: string;
  icp: string;
  statusLine: string;
  fridayReady: boolean;
  seats: Seat[];
  toastDay?: {
    date: string;
    source: string;
    net: number;
    gross: number;
    laborCost: number;
    laborPct: number;
    splh: number;
    guests: number;
    orders: number;
    avgGuest: number;
    tips: number;
    discounts: number;
    voids: number;
    voidOrders: number;
  };
  toastWeek?: {
    range: string;
    source: string;
    note: string;
    net: number;
    units: number;
    skuCount: number;
    food: number;
    liquor: number;
    mix: MixRow[];
  };
  hours?: HourRow[];
  dayparts?: { name: string; net: number; orders: number }[];
  jobs?: { job: string; hours: number; cost: number; people: number }[];
  findings: Finding[];
  evidence: { name: string; kind: string; when: string; note: string }[];
};
