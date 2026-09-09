export type Pain = "labor" | "cash" | "fragmented" | "";

export type Wave = {
  id: string;
  wave: number;
  ask: string;
  captures: string;
  missing: string;
};

export const WAVES: Wave[] = [
  {
    id: "pain",
    wave: 0,
    ask: "What problem are you trying to solve? Labor? Cash flow? Or you’re just tired of fragmented data sitting here guessing? No worries — we got you.",
    captures: "pain",
    missing: "Why they sat down",
  },
  {
    id: "pos-email",
    wave: 0,
    ask: "We don’t need to integrate yet. Where does your POS email the nightly reports — sales, labor, voids? Forward that email, take a picture of it, or drop the download. We’ll do the hard work.",
    captures: "inbox / source route",
    missing: "Where the close lands",
  },
  {
    id: "schedule",
    wave: 1,
    ask: "Can you take a picture of the schedules? That way we know how many people are on, and we’ll see if labor is drifting — labor’s one of the biggest things right now.",
    captures: "schedule photo",
    missing: "Posted seats",
  },
  {
    id: "cards",
    wave: 2,
    ask: "You gave us a schedule — do you have labor cards, or is it shift / role specific? How this shop runs the seats.",
    captures: "stations + seat shape",
    missing: "How this floor actually runs",
  },
  {
    id: "trucks",
    wave: 3,
    ask: "Do you use Performance, Sysco? Cool — how many times a week do those main trucks hit you? Any local vendors too? Do they email the invoice, or are you still photographing every ticket?",
    captures: "vendor cadence + invoice path",
    missing: "Truck days",
  },
  {
    id: "menu",
    wave: 4,
    ask: "Can we get a picture of your menu so we can show you where the plate costs are drifting? You shouldn’t sit there doing SKUs by hand. Recipes suck. Figuring out the chaos is the one thing we’re good at.",
    captures: "menu + top plates",
    missing: "Plate map",
  },
];

export function openLine(pain: Pain): string {
  if (pain === "labor") {
    return "Labor. Cool — drop last night’s close, then we’ll want a picture of the schedule.";
  }
  if (pain === "cash") {
    return "Cash flow / DoorDash? Got a redacted statement — paste page 1, we’ll label the math.";
  }
  if (pain === "fragmented") {
    return "Fragmented data. We don’t integrate day one. Where does the POS email the reports? Forward, photo, or Drive.";
  }
  return WAVES[0].ask;
}
