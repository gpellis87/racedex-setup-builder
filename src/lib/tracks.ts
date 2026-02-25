import { TrackDefinition } from "@/types/setup";

export const tracks: TrackDefinition[] = [
  // Short Tracks
  {
    id: "martinsville",
    name: "Martinsville Speedway",
    type: "short",
    lengthMiles: 0.526,
    banking: "12° turns, flat straights",
    description: "Tight paperclip-shaped short track. Extremely heavy braking, tight corners, flat straights. Mechanical grip is king here.",
  },
  {
    id: "bristol",
    name: "Bristol Motor Speedway",
    type: "short",
    lengthMiles: 0.533,
    banking: "24-28° turns",
    description: "High-banked concrete short track. Very fast for its size. Banking allows higher corner speeds. Progressive banking in turns.",
  },
  {
    id: "richmond",
    name: "Richmond Raceway",
    type: "short",
    lengthMiles: 0.75,
    banking: "14° turns",
    description: "D-shaped short track that drives like a mini intermediate. Mix of short track mechanical grip and aero sensitivity.",
  },
  {
    id: "iowa",
    name: "Iowa Speedway",
    type: "short",
    lengthMiles: 0.875,
    banking: "12-14° turns",
    description: "Progressive banking D-shaped short track. Very similar to Richmond in character. Tire management is critical.",
  },
  {
    id: "phoenix",
    name: "Phoenix Raceway",
    type: "short",
    lengthMiles: 1.0,
    banking: "8-11° turns",
    description: "Flat, asymmetric 1-mile track. Turn 1-2 is different from Turn 3-4. Very low banking makes mechanical grip paramount.",
  },
  {
    id: "new_hampshire",
    name: "New Hampshire Motor Speedway",
    type: "short",
    lengthMiles: 1.058,
    banking: "2-7° turns",
    description: "Flat 1-mile track nicknamed The Magic Mile. Very low banking requires lots of mechanical grip. Turns are very different from each other.",
  },
  {
    id: "dover",
    name: "Dover Motor Speedway",
    type: "short",
    lengthMiles: 1.0,
    banking: "24° turns",
    description: "Concrete 1-mile track with high banking. Known as the Monster Mile. Heavy on tires and requires precise setup.",
  },

  // Intermediate Tracks
  {
    id: "charlotte",
    name: "Charlotte Motor Speedway",
    type: "intermediate",
    lengthMiles: 1.5,
    banking: "24° turns, 5° straights",
    description: "The quintessential 1.5-mile intermediate. Good balance of aero and mechanical grip. Quad-oval shape.",
  },
  {
    id: "atlanta",
    name: "Atlanta Motor Speedway",
    type: "intermediate",
    lengthMiles: 1.54,
    banking: "28° turns",
    description: "Recently reconfigured with higher banking. Now produces pack-style racing similar to superspeedways. Very aero-dependent.",
  },
  {
    id: "kansas",
    name: "Kansas Speedway",
    type: "intermediate",
    lengthMiles: 1.5,
    banking: "15-17° turns",
    description: "Tri-oval with progressive banking. Lower banking than Charlotte makes it more challenging. D-shaped with different turn characteristics.",
  },
  {
    id: "las_vegas",
    name: "Las Vegas Motor Speedway",
    type: "intermediate",
    lengthMiles: 1.5,
    banking: "12-20° turns",
    description: "Classic 1.5-mile intermediate with progressive banking. Good baseline track for testing intermediate setups.",
  },
  {
    id: "homestead",
    name: "Homestead-Miami Speedway",
    type: "intermediate",
    lengthMiles: 1.5,
    banking: "18-20° turns",
    description: "Progressive banking with multiple grooves. Variable banking provides multiple lines through the corners.",
  },
  {
    id: "chicagoland",
    name: "Chicagoland Speedway",
    type: "intermediate",
    lengthMiles: 1.5,
    banking: "18° turns",
    description: "Tri-oval 1.5-mile intermediate. Smooth surface with consistent banking. Good representative intermediate track.",
  },
  {
    id: "texas",
    name: "Texas Motor Speedway",
    type: "intermediate",
    lengthMiles: 1.5,
    banking: "20-24° turns",
    description: "Quad-oval with high banking. Turns 1-2 have more banking than 3-4, creating asymmetric setup demands.",
  },
  {
    id: "nashville_ss",
    name: "Nashville Superspeedway",
    type: "intermediate",
    lengthMiles: 1.33,
    banking: "14° turns",
    description: "Concrete 1.33-mile intermediate. The concrete surface combined with moderate banking requires careful tire management.",
  },

  // Speedways (1.5+ mile non-superspeedway)
  {
    id: "michigan",
    name: "Michigan International Speedway",
    type: "speedway",
    lengthMiles: 2.0,
    banking: "12-18° turns",
    description: "Wide 2-mile track with moderate banking. Very fast, very aero-dependent. Wide racing surface allows multiple grooves.",
  },
  {
    id: "pocono",
    name: "Pocono Raceway",
    type: "speedway",
    lengthMiles: 2.5,
    banking: "6-14° turns",
    description: "Triangular 2.5-mile track with three distinct turns. Each corner requires different setup compromise. Known as the Tricky Triangle.",
  },
  {
    id: "darlington",
    name: "Darlington Raceway",
    type: "speedway",
    lengthMiles: 1.366,
    banking: "23-25° turns",
    description: "Egg-shaped track nicknamed Too Tough to Tame. Turns are different widths and banking. Right-side wall management is crucial.",
  },

  // Superspeedways
  {
    id: "daytona",
    name: "Daytona International Speedway",
    type: "superspeedway",
    lengthMiles: 2.5,
    banking: "31° turns, 18° tri-oval",
    description: "Iconic 2.5-mile superspeedway. Drafting and pack racing. Aero is everything. Setups focus on drag reduction and stability in the draft.",
  },
  {
    id: "talladega",
    name: "Talladega Superspeedway",
    type: "superspeedway",
    lengthMiles: 2.66,
    banking: "33° turns",
    description: "The longest and fastest oval on the schedule. Even more aero-dependent than Daytona. Pack racing demands stability.",
  },
];

export function getTrackById(id: string): TrackDefinition | undefined {
  return tracks.find((t) => t.id === id);
}

export function getTracksByType(type: TrackDefinition["type"]): TrackDefinition[] {
  return tracks.filter((t) => t.type === type);
}
