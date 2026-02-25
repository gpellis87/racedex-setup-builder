/**
 * Comprehensive oval NASCAR setup knowledge base.
 *
 * Sources synthesized: OS Racing Next Gen Setup Matrix, Ray Alfalla truck setup
 * guides, iRacing forums, Commodore's Garage series, and general oval racing
 * engineering principles.
 *
 * Exported as a single string constant so it can be injected verbatim into the
 * AI system prompt — this keeps all domain knowledge in one place while giving
 * the LLM full context.
 */

export const OVAL_SETUP_KNOWLEDGE = `
## CORE OVAL RACING CONCEPTS

All three NASCAR series (Cup Next Gen, Xfinity, Truck) race LEFT-TURNING ovals.
The setup goal is to optimize the car for continuous left-hand turns while
maintaining stability and speed on the straights.

**Weight Transfer Basics**
- Under braking: weight shifts FORWARD → front tires gain grip, rears lose grip
- Under acceleration: weight shifts REARWARD → rear tires gain grip, fronts lose
- In a left turn: weight shifts RIGHT → right-side tires are loaded, left-side unloaded
- The combination of these three forces at any moment determines handling balance

**Cross Weight (Wedge)**
Cross weight = (RF + LR weight) / total weight × 100. A higher cross weight
(more wedge) pushes the car toward tight / understeer. A lower cross weight
pushes toward loose / oversteer. Cross weight is the single fastest way to shift
overall handling balance. On the Next Gen, cross weight is adjusted via ARB
preload or shock collar offsets. On the Xfinity and Truck, it is adjusted with
wedge bolts or track bar height.

**Track Bar (Xfinity & Truck)**
The track bar locates the rear axle laterally. RAISING the track bar on the
right side moves the rear roll center higher, which transfers more weight to the
left rear tire under cornering → tighter. LOWERING it does the opposite → looser.

**Sway Bar (Anti-Roll Bar)**
The sway bar resists body roll. A STIFFER (larger diameter) front sway bar
reduces front roll → front tires share load less effectively → tighter on turn
entry. A softer front bar → looser on entry.

**Springs**
- Stiffer front springs: reduce front dive under braking, improve aero platform
  stability, but can cause tight entry
- Softer front springs: more mechanical grip on entry, but more chassis movement
- Stiffer rear springs: stabilize the rear, reduce squat → can cause tight exit
- Softer rear springs: more rear grip on exit, but less platform stability
- SPRING SPLIT (LR vs RR): Increasing LR spring relative to RR promotes
  rotation through the center (helps tight). Opposite promotes stability (helps
  loose).

**Shock Absorbers (Xfinity & Truck)**
- Compression (bump): Controls how fast the spring compresses (weight coming ON
  the tire). More compression = slower weight transfer onto that corner.
- Rebound: Controls how fast the spring extends (weight coming OFF the tire).
  More rebound = slower weight transfer off that corner.
- Front shock adjustments primarily affect entry and transition behavior.
- Rear shock adjustments primarily affect exit and corner-exit weight transfer.

**Shock Collar Offsets (Next Gen Cup)**
The Next Gen uses shock collar offsets instead of traditional ride height
adjustments. These set preload on the springs and affect both ride height and
cross weight simultaneously. Adjusting one corner's offset affects all four
corner weights — always verify cross weight after changes.

**Tire Pressure**
- Higher pressure = stiffer tire sidewall = less grip on that corner
- Lower pressure = more compliant sidewall = more grip on that corner
- Right-side tires run higher pressure because they carry more load in turns
- Left-side tires typically run 60-70% of right-side pressure
- Tire pressure increases with temperature during a run, so cold pressures must
  account for heat buildup

**Camber**
Camber tilts the tire relative to the track surface (negative = top leans
inward). On an oval, negative camber on the right front is critical — it helps
the right front tire maintain full contact patch during left turns. Optimal RF
camber is found when the left edge of the RF tire is about 10°F hotter than the
middle after a short run. More negative RF camber = better short-run grip, less
negative = better long-run tire wear.

**Caster**
Caster angle affects steering weight and dynamic camber gain (how much camber
changes as steering input increases). More caster = more dynamic camber gain =
better turn-in response, heavier steering.

**Toe**
- Toe-out (front): improves turn-in response but can make the car darty on
  straights and increase tire wear
- Toe-in (front): improves straight-line stability but can reduce turn-in

**Tape / Aero**
Grille tape reduces airflow through the radiator, which smooths the front
aero surface. More tape = more front downforce AND more drag. At high speeds
(intermediates, speedways), tape significantly affects aero balance. On short
tracks, tape matters less because speeds are lower. More tape helps a loose car
(adds front downforce), but too much can cause overheating.

**Nose Weight**
Adjustable ballast that shifts the car's static weight balance forward or
rearward. More nose weight = more mechanical grip on the front = helps tight.
Less nose weight = more mechanical grip on the rear = helps loose, especially on
long runs.

---

## HANDLING DIAGNOSIS AND FIXES

### TIGHT (UNDERSTEER) — The car pushes / won't turn

**Tight on ENTRY (turn-in to apex):**
- Decrease cross weight (lower wedge)
- Decrease nose weight
- Soften RF spring
- Lower RF tire pressure
- Increase RF camber (more negative)
- Soften front sway bar
- Reduce front brake bias
- (Xfinity/Truck) Lower front ride height
- (Xfinity/Truck) Increase front shock compression to slow weight transfer onto front
- (Next Gen) Adjust ARB preload: left arrow on front, right arrow on rear

**Tight in CENTER (mid-corner, off-throttle):**
- Stiffen LR spring and soften RR spring (increase rear spring split)
- Decrease cross weight
- (Xfinity/Truck) Raise track bar height
- Less tape / less front downforce (on fast tracks)
- (Xfinity/Truck) Reduce front sway bar
- More front toe-out for better rotation

**Tight in CENTER (mid-corner, on-throttle):**
- Soften LR spring and stiffen RR spring
- Decrease cross weight
- (Xfinity/Truck) Reduce rear shock rebound (let weight transfer off rear faster)

**Tight on EARLY EXIT (getting back on throttle):**
- Soften LR spring and stiffen RR spring
- (Xfinity/Truck) Reduce RR shock rebound
- Decrease cross weight slightly
- Increase rear spring split

**Tight on LATE EXIT (accelerating out):**
- On low-banked tracks: soften RR spring, lower cross weight
- On high-banked tracks: soften LR spring, stiffen RR spring
- Decrease RR tire pressure
- Stiffen all springs if caused by ride height instability

**Tight on SHORT RUNS:**
- More negative RF camber (better initial grip)
- Decrease LR tire pressure
- More front toe-out

**Tight on LONG RUNS:**
- Less negative RF camber (reduces RF tire wear)
- Soften LR spring
- Less tape (if overheating is a factor)
- Reduce nose weight to shift weight rearward

### LOOSE (OVERSTEER) — The rear wants to come around

**Loose on ENTRY (turn-in to apex):**
- Increase cross weight (more wedge)
- Increase nose weight
- Stiffen RF spring
- Raise RF tire pressure
- Less negative RF camber
- Stiffen front sway bar
- Increase front brake bias
- (Xfinity/Truck) Raise front ride height
- (Next Gen) Adjust ARB preload: right arrow on front, left arrow on rear

**Loose in CENTER (off-throttle):**
- Soften LR spring and stiffen RR spring
- Increase cross weight
- (Xfinity/Truck) Lower track bar height
- Stiffen front sway bar

**Loose in CENTER (on-throttle):**
- Stiffen LR spring and soften RR spring
- Increase cross weight

**Loose on EARLY EXIT:**
- Stiffen LR spring, soften RR spring
- (Xfinity/Truck) Increase RR shock rebound
- Increase RR tire pressure

**Loose on LATE EXIT:**
- On low-banked tracks: stiffen RR spring, increase cross weight
- On high-banked tracks: stiffen LR spring, soften RR spring
- Increase RR tire pressure

**Loose on SHORT RUNS:**
- Less negative RF camber (increase with right arrow)
- Increase LR tire pressure
- Add tape for more front aero grip (on faster tracks)

**Loose on LONG RUNS:**
- More negative RF camber
- Use less throttle in turns (driving advice)
- Stiffen LR spring
- Reduce tape if car is overheating

---

## CAR-SPECIFIC NOTES

### NASCAR NEXT GEN CUP CAR
- Uses INDEPENDENT rear suspension — very different from traditional stock cars
- Shock collar offsets control ride height AND cross weight simultaneously
- Has BOTH front and rear anti-roll bars (ARBs)
- ARB preload is the primary cross weight adjustment — keep front preload
  negative as a general rule
- Sequential transaxle — no individual gear ratios, just final drive
- The IRS makes rear spring adjustments behave differently than solid axle cars
- Aero is extremely important at intermediates and above; the car is very
  sensitive to ride height (splitter seal) and rake
- Stiffer springs generally help aero platform stability → more consistent
  downforce → faster at speed but potentially less mechanical grip

### NASCAR XFINITY SERIES
- Traditional solid rear axle with truck arm rear suspension
- Track bar is a primary handling adjustment (not available on Next Gen)
- Has individual gear ratios (4-speed + final drive)
- Shock adjustments (compression and rebound) are independently tunable
- Generally more forgiving to drive than the Cup car
- Cross weight adjusted through wedge bolts
- Ride heights are directly adjustable

### NASCAR CRAFTSMAN TRUCK SERIES
- Also solid rear axle, similar concept to Xfinity
- Generally the most forgiving of the three to drive
- Great platform for learning setup fundamentals
- Slightly less power and grip than Xfinity
- Setup principles are essentially the same as Xfinity
- Trucks are lighter and can be more responsive to small changes

---

## TRACK-TYPE SETUP PHILOSOPHY

### Short Tracks (Martinsville, Bristol, Richmond, Phoenix, etc.)
- Mechanical grip is dominant over aero
- Setup focuses on corner entry/exit rotation and braking stability
- Tire pressure is a major tuning lever
- Springs are generally softer to maximize mechanical grip
- Tape matters less (lower speeds)
- Gear ratios need to be shorter for slower corner speeds
- Brake setup is critical — heavy braking zones
- Cross weight is the primary balance tool

### Intermediate Tracks (Charlotte, Kansas, Las Vegas, Texas, etc.)
- Balance of aero and mechanical grip
- Aero platform (ride heights, spring stiffness) becomes important
- Tape starts mattering — balance cooling vs. aero benefit
- Splitter seal is critical for front downforce
- Spring stiffness matters more for aero stability
- Long-run speed often differs from short-run balance
- Setup must work over full fuel runs

### Speedways (Michigan, Pocono, Darlington)
- Aero grip becomes dominant at Michigan, mixed at Pocono/Darlington
- Michigan: very flat, very fast — aero is everything
- Pocono: three different corners need compromise setup
- Darlington: high banking but narrow — setup must handle wall proximity

### Superspeedways (Daytona, Talladega)
- Almost purely aero-dependent
- Drafting/pack racing means stability in dirty air matters most
- Maximum tape for downforce (cooling isn't an issue in the draft)
- Stiff springs for aero platform stability
- Handling adjustments are minimal — focus on drag reduction and stability
- Gear ratio selected for top speed in the draft

---

## GENERAL SETUP PROCESS

1. **Start with a baseline**: Use the iRacing default or a community baseline setup
2. **Set ride heights first**: Ensure proper splitter gap and rear ride height
3. **Set spring rates**: Establish the aero platform (stiffer for fast tracks)
4. **Set cross weight / wedge**: Get the basic handling balance (tight vs. loose)
5. **Adjust tire pressures**: Fine-tune grip balance corner by corner
6. **Tune camber**: Optimize tire contact patch, especially RF camber
7. **Dial in shocks**: Fine-tune transient behavior (how quickly handling changes)
8. **Adjust tape/aero**: Final aero balance for the track's speed range
9. **Set gearing**: Match RPM range to track requirements
10. **Test and iterate**: Make ONE change at a time, run 5+ laps to evaluate

When the user describes a problem, ALWAYS ask:
- Which car and track?
- Where in the corner does it happen? (entry, center, exit)
- Is it a short-run or long-run issue?
- How severe is it? (mild push, car won't turn at all, snaps loose, etc.)
- What is the current setup baseline?
`;
