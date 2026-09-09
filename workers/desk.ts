const COOKIE = "n86_seat";

type HouseId = "grill" | "community-tap";
type Pain = "labor" | "cash" | "fragmented" | "";

const GRILL = {
  id: "grill" as HouseId,
  name: "The New American Grill",
  city: "Single-unit · Toast house",
  friday: true,
  seats: "Max · owner · Friday try · Kristen Courser load",
  win: {
    title: "Labor ran 35.56% of net",
    dollars: "$1,211.85 on $3,408.15",
    move: "Hold 30% as the floor. That day was ~$189 heavy. Cook hours (45.2) are the pile — cut one mid shift before 4pm, keep the 5–7 fire line.",
    receipt: "Toast Labor Breakdown 2026-08-31 · Kristen Courser · SPLH $35.17",
  },
  day: { net: 3408.15, labor: 1211.85, pct: 35.56, splh: 35.17, guests: 119, discounts: 162.35, voids: 31 },
  mix: [
    "Burger Dinner · 118 · $2,208",
    "Stir Fry · 47 · $1,037",
    "Fish & Chips · 42 · $989",
    "Green Curry · 36 · $855",
    "Burger Lunch · 42 · $716",
  ],
  hours: [
    [11, 80],
    [12, 250],
    [17, 695],
    [18, 1303],
    [19, 286],
  ],
};

const CTAP = {
  id: "community-tap" as HouseId,
  name: "Community Tap & Pizza",
  city: "Fort Dodge, IA",
  friday: false,
  seats: "Myke · Kenzy · Tom · sold",
  win: {
    title: "Olive oil moved 15.8%",
    dollars: "$10.80 / case",
    move: "Verify pack size, then ask the vendor to explain the increase before the next order.",
    receipt: "Two invoice periods · same vendor · same SKU · $68.40 → $79.20",
  },
  day: null as null | typeof GRILL.day,
  mix: [] as string[],
  hours: [] as [number, number][],
};

function houseOf(id?: string) {
  return id === "community-tap" || id === "ctap" ? CTAP : GRILL;
}

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function openLine(pain: Pain) {
  if (pain === "labor") return "Labor. Cool — drop last night’s close, then we’ll want a picture of the schedule.";
  if (pain === "cash") return "Cash flow / DoorDash? Got a redacted statement — paste page 1, we’ll label the math.";
  if (pain === "fragmented")
    return "Fragmented data. We don’t integrate day one. Where does the POS email the reports? Forward, photo, or Drive.";
  return "What problem — labor, cash flow, or fragmented data sitting here guessing? No worries. We got you.";
}

function reply(house: typeof GRILL | typeof CTAP, text: string, pain: Pain) {
  const q = text.toLowerCase();
  if (!q || /hey|hello|hi|start|help/.test(q)) {
    return `${openLine(pain)}\n\nHere’s one move from the book we already have — ${house.win.title}. ${house.win.dollars}.\n${house.win.move}\nReceipt: ${house.win.receipt}\n\nWe don’t need to integrate yet. Where does your POS email the nightly reports?`;
  }
  if (/labor|payroll|schedule|punch|cook|splh/.test(q) && house.day) {
    return `Toast day 2026-08-31: net ${money(house.day.net)}, labor ${money(house.day.labor)} = ${house.day.pct}%, SPLH ${money(house.day.splh)}. A 30% floor would have been about ${money(house.day.net * 0.3)} — that day ran ~${money(house.day.labor - house.day.net * 0.3)} heavy.\n${house.win.move}\nReceipt: ${house.win.receipt}\n\nMissing still: picture of the schedules. Punch ≠ schedule until that lands.`;
  }
  if (/6pm|dinner|lunch|peak|hour/.test(q)) {
    return `6pm is the house. $1,302.90 / 19 tickets. Staff the 5–7 window like it is the whole day. Lunch is $793 / 19 tickets — do not match dinner headcount at 11.\nReceipt: Sales Summary by hour · 2026-08-31`;
  }
  if (/burger|menu|sku|mix/.test(q)) {
    return `Week 8/24–8/30: $36,827.34 across 234 SKUs. Labor day and sales week are different windows — do not blend them into one fake prime cost.\n${house.mix.join("\n")}\nProtect burger food cost first. 160 burgers in the week.`;
  }
  if (/void|comp|discount/.test(q) && house.day) {
    return `Discounts ${money(house.day.discounts)}. Voids ${money(house.day.voids)} on 2 tickets. Voids are not the leak. Labor is.\nName who comped. Bar $100.75, dining $61.60.`;
  }
  return `${house.win.title}. ${house.win.dollars}.\n${house.win.move}\nReceipt: ${house.win.receipt}`;
}

function css() {
  return `:root{--paper:#efe4cc;--ink:#1b1610;--mute:#5c5348;--stamp:#b42318;--rule:#d4c6a8;--card:#f7f0de}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Newsreader,Iowan Old Style,Georgia,serif}
a{color:inherit}.wrap{max-width:1100px;margin:0 auto;padding:28px 20px}
.stamp{color:var(--stamp);font-family:ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;font-size:11px}
h1{font-style:italic;font-weight:500;margin:.2em 0}.ticket{background:var(--card);border:1px solid var(--rule);box-shadow:4px 4px 0 #1b161014;padding:18px}
.btn{display:inline-block;background:var(--ink);color:var(--paper);padding:12px 18px;text-decoration:none;border:0;font:inherit;cursor:pointer}
.btn2{display:inline-block;border:1px solid var(--ink);padding:12px 18px;text-decoration:none}
.grid{display:grid;gap:16px}.g2{grid-template-columns:1.2fr .8fr}.g3{grid-template-columns:1fr 1fr 1fr}
.mono{font-family:ui-monospace,monospace}.mute{color:var(--mute)}
input,select{width:100%;padding:10px;border:1px solid var(--rule);background:var(--paper);font:inherit;margin-top:6px}
label{display:block;margin:12px 0}.hot{color:var(--stamp)}
@media(max-width:800px){.g2,.g3{grid-template-columns:1fr}}`;
}

function shell(title: string, body: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<style>${css()}</style></head><body>${body}</body></html>`;
}

function home() {
  return shell(
    "Never 86'd — Action Shift",
    `<main class="wrap">
      <p class="stamp">Action Shift · Track A · Cloudflare</p>
      <header style="display:flex;justify-content:space-between;border-bottom:2px solid var(--ink);padding-bottom:12px">
        <h1 style="font-size:48px">Never 86'd</h1>
        <p class="mono mute">First ten are friends.<br>Ten minutes to win.</p>
      </header>
      <section class="grid g2" style="margin-top:36px">
        <div>
          <p class="stamp">Not software. A close.</p>
          <h1 style="font-size:36px;font-style:normal">What problem — labor, cash flow, or fragmented data sitting here guessing?</h1>
          <p class="mute">No worries. We got you. We don’t integrate day one. Forward the POS email, photo the schedule, keep the receipt. One seat’s free.</p>
          <p style="margin-top:24px">
            <a class="btn" href="/claim?house=grill&pain=labor">Friday seat · Max’s Grill</a>
            <a class="btn2" href="/api/demo?house=grill" style="margin-left:8px">Skip the talk. Show the leak.</a>
          </p>
        </div>
        <aside class="ticket">
          <p class="stamp">Already on the blotter</p>
          <h1>${GRILL.name}</h1>
          <p class="mute">Kristen Courser packs · Toast 8/31</p>
          <p>Net <b class="mono">${money(GRILL.day.net)}</b></p>
          <p>Labor <b class="mono hot">${GRILL.day.pct}%</b></p>
          <p>SPLH <b class="mono">${money(GRILL.day.splh)}</b></p>
          <p>Toast IQ shows the number. We name the move: cut the mid-shift before 4. Keep 5–7. Burger is the engine.</p>
        </aside>
      </section>
    </main>`,
  );
}

function claim() {
  return shell(
    "Claim a seat",
    `<main class="wrap" style="max-width:560px">
      <p class="stamp">Seat 1 is free · no password</p>
      <h1>Sit down. Ten minutes.</h1>
      <form class="ticket" method="post" action="/api/session">
        <label>What do they call you<input name="name" required placeholder="Max"></label>
        <label>Login if you have one<input name="who" placeholder="max · kristen · myke"></label>
        <label>House
          <select name="house">
            <option value="grill">The New American Grill · Friday</option>
            <option value="community-tap">Community Tap & Pizza · lab</option>
          </select>
        </label>
        <p>What problem</p>
        <label><input type="radio" name="pain" value="labor" checked> Labor</label>
        <label><input type="radio" name="pain" value="cash"> Cash flow</label>
        <label><input type="radio" name="pain" value="fragmented"> Fragmented data</label>
        <button class="btn" style="width:100%;margin-top:12px">Open the desk</button>
      </form>
    </main>`,
  );
}

function operator(house: typeof GRILL | typeof CTAP, name: string, pain: Pain) {
  const opener = reply(house, "start", pain);
  const stats = house.day
    ? `<dl class="grid g3"><div>Net<div class="mono">${money(house.day.net)}</div></div><div>Labor<div class="mono hot">${house.day.pct}%</div></div><div>SPLH<div class="mono">${money(house.day.splh)}</div></div></dl>`
    : `<p class="mute">Paper house. Invoice + labor-card drift until a POS email lands.</p>`;
  return shell(
    house.name,
    `<main class="wrap">
      <header style="display:flex;justify-content:space-between;border-bottom:2px solid var(--ink);padding-bottom:10px">
        <div><p class="stamp">${house.friday ? "Friday seat" : "Lab seat"}</p><h1>${house.name}</h1><p class="mute">${name} · ${house.city} · houses never mix</p></div>
        <div class="mono" id="clock">10:00 to win</div>
      </header>
      <section class="grid g2" style="margin-top:20px">
        <article class="ticket">
          <p class="stamp">The 10-minute win</p>
          <h1>${house.win.title}</h1>
          <p class="mono hot" style="font-size:28px">${house.win.dollars}</p>
          <p>${house.win.move}</p>
          <p class="mute">Receipt: ${house.win.receipt}</p>
          ${stats}
        </article>
        <article class="ticket" style="display:flex;flex-direction:column;min-height:28rem">
          <p class="stamp">LLM socket · grounded · this house only</p>
          <div id="log" style="flex:1;white-space:pre-wrap">${opener.replace(/</g, "&lt;")}</div>
          <div>${["labor", "6pm", "burger", "voids"].map((c) => `<button class="btn2" data-chip="${c}" style="margin:4px;padding:6px 10px">${c}</button>`).join("")}</div>
          <form id="chat" style="display:flex;margin-top:8px"><input name="text" placeholder="Talk like an owner"><button class="btn">Send</button></form>
        </article>
      </section>
      <script id="book" type="application/json">${JSON.stringify({ house, pain, opener })}</script>
      <script>
      const book = JSON.parse(document.getElementById('book').textContent);
      const house = book.house;
      function money(n){ return n.toLocaleString('en-US',{style:'currency',currency:'USD'}); }
      function grounded(text){
        const q=(text||'').toLowerCase();
        if(!q || /hey|hello|hi|start|help/.test(q)) return book.opener;
        if(/labor|payroll|schedule|punch|cook|splh/.test(q) && house.day){
          return 'Toast day 2026-08-31: net '+money(house.day.net)+', labor '+money(house.day.labor)+' = '+house.day.pct+'%, SPLH '+money(house.day.splh)+'. A 30% floor would have been about '+money(house.day.net*0.3)+' — that day ran ~'+money(house.day.labor-house.day.net*0.3)+' heavy.\\n'+house.win.move+'\\nReceipt: '+house.win.receipt+'\\n\\nMissing still: picture of the schedules. Punch ≠ schedule until that lands.';
        }
        if(/6pm|dinner|lunch|peak|hour/.test(q)){
          return '6pm is the house. $1,302.90 / 19 tickets. Staff the 5–7 window like it is the whole day. Lunch is $793 / 19 tickets — do not match dinner headcount at 11.\\nReceipt: Sales Summary by hour · 2026-08-31';
        }
        if(/burger|menu|sku|mix/.test(q)){
          return 'Week 8/24–8/30: $36,827.34 across 234 SKUs. Labor day and sales week are different windows — do not blend them into one fake prime cost.\\n'+(house.mix||[]).join('\\n')+'\\nProtect burger food cost first. 160 burgers in the week.';
        }
        if(/void|comp|discount/.test(q) && house.day){
          return 'Discounts '+money(house.day.discounts)+'. Voids '+money(house.day.voids)+' on 2 tickets. Voids are not the leak. Labor is.\\nName who comped. Bar $100.75, dining $61.60.';
        }
        return house.win.title+'. '+house.win.dollars+'.\\n'+house.win.move+'\\nReceipt: '+house.win.receipt;
      }
      let left=600; setInterval(()=>{left=Math.max(0,left-1); const m=Math.floor(left/60); document.getElementById('clock').textContent=m+':'+String(left%60).padStart(2,'0')+' to win';},1000);
      const log=document.getElementById('log');
      function send(t){ if(!t) return; log.textContent += '\\n\\nYOU  '+t+'\\n\\n'+grounded(t); log.scrollTop=log.scrollHeight; }
      document.getElementById('chat').onsubmit=(e)=>{e.preventDefault(); const i=e.target.text; send(i.value); i.value='';};
      document.querySelectorAll('[data-chip]').forEach(b=>b.onclick=()=>send(b.dataset.chip));
      </script>
    </main>`,
  );
}

function readSess(req: Request) {
  const raw = req.headers.get("Cookie")?.match(new RegExp(`${COOKIE}=([^;]+)`))?.[1];
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as { houseId: HouseId; name: string; pain: Pain };
  } catch {
    return null;
  }
}

function setSess(data: { houseId: HouseId; name: string; pain: Pain }, loc: string) {
  const headers = new Headers({ Location: loc });
  headers.append(
    "Set-Cookie",
    `${COOKIE}=${encodeURIComponent(JSON.stringify(data))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1209600`,
  );
  return new Response(null, { status: 302, headers });
}

export default {
  async fetch(req: Request) {
    const url = new URL(req.url);
    const sess = readSess(req);

    if (url.pathname === "/") return new Response(home(), { headers: { "content-type": "text/html;charset=utf-8" } });
    if (url.pathname === "/claim") return new Response(claim(), { headers: { "content-type": "text/html;charset=utf-8" } });

    if (url.pathname === "/api/demo") {
      const house = houseOf(url.searchParams.get("house") || "grill");
      return setSess({ houseId: house.id, name: house.id === "grill" ? "Max" : "Myke", pain: "labor" }, "/operator");
    }

    if (url.pathname === "/api/session" && req.method === "POST") {
      const form = await req.formData();
      const house = houseOf(String(form.get("house") || "grill"));
      return setSess(
        {
          houseId: house.id,
          name: String(form.get("name") || "friend"),
          pain: (String(form.get("pain") || "labor") as Pain) || "labor",
        },
        "/operator",
      );
    }

    if (url.pathname === "/api/socket" && req.method === "POST") {
      const body = (await req.json()) as { text?: string };
      const house = houseOf(sess?.houseId);
      return new Response(reply(house, body.text || "", sess?.pain || "labor"), {
        headers: { "content-type": "text/plain;charset=utf-8" },
      });
    }

    if (url.pathname === "/operator") {
      if (!sess) return Response.redirect(new URL("/claim?house=grill&pain=labor", url), 302);
      return new Response(operator(houseOf(sess.houseId), sess.name, sess.pain), {
        headers: { "content-type": "text/html;charset=utf-8" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
