import { CarDefinition, CarId } from "@/types/setup";

export const cars: CarDefinition[] = [
  {
    id: "nextgen_cup",
    name: "NASCAR Cup Series Next Gen",
    series: "NASCAR Cup Series (Class A)",
    description:
      "The Next Gen Cup car features independent rear suspension, a sequential transaxle, and significantly different setup characteristics from previous Cup cars. Uses shock collar offsets for ride height and crossweight adjustments.",
    parameters: [
      {
        group: "Tires",
        params: [
          { key: "tire_pressure_lf", label: "LF Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 22 },
          { key: "tire_pressure_rf", label: "RF Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 32 },
          { key: "tire_pressure_lr", label: "LR Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 20 },
          { key: "tire_pressure_rr", label: "RR Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 30 },
        ],
      },
      {
        group: "Springs",
        params: [
          { key: "spring_rate_lf", label: "LF Spring Rate", unit: "lbs/in", min: 100, max: 800, step: 25, defaultValue: 250 },
          { key: "spring_rate_rf", label: "RF Spring Rate", unit: "lbs/in", min: 100, max: 800, step: 25, defaultValue: 250 },
          { key: "spring_rate_lr", label: "LR Spring Rate", unit: "lbs/in", min: 100, max: 600, step: 25, defaultValue: 200 },
          { key: "spring_rate_rr", label: "RR Spring Rate", unit: "lbs/in", min: 100, max: 600, step: 25, defaultValue: 200 },
        ],
      },
      {
        group: "Shock Collar Offsets",
        params: [
          { key: "shock_collar_lf", label: "LF Shock Collar Offset", unit: "clicks", min: -20, max: 20, step: 1, defaultValue: 0 },
          { key: "shock_collar_rf", label: "RF Shock Collar Offset", unit: "clicks", min: -20, max: 20, step: 1, defaultValue: 0 },
          { key: "shock_collar_lr", label: "LR Shock Collar Offset", unit: "clicks", min: -20, max: 20, step: 1, defaultValue: 0 },
          { key: "shock_collar_rr", label: "RR Shock Collar Offset", unit: "clicks", min: -20, max: 20, step: 1, defaultValue: 0 },
        ],
      },
      {
        group: "Anti-Roll Bar (Sway Bar)",
        params: [
          { key: "arb_preload_front", label: "Front ARB Preload", unit: "clicks", min: -20, max: 20, step: 1, defaultValue: -2 },
          { key: "arb_preload_rear", label: "Rear ARB Preload", unit: "clicks", min: -20, max: 20, step: 1, defaultValue: 0 },
          { key: "arb_size_front", label: "Front ARB Size", unit: "in", min: 0.800, max: 1.500, step: 0.0625, defaultValue: 1.125 },
          { key: "arb_size_rear", label: "Rear ARB Size", unit: "in", min: 0.800, max: 1.500, step: 0.0625, defaultValue: 1.000 },
        ],
      },
      {
        group: "Alignment",
        params: [
          { key: "camber_lf", label: "LF Camber", unit: "deg", min: -5, max: 0, step: 0.1, defaultValue: -3.5 },
          { key: "camber_rf", label: "RF Camber", unit: "deg", min: -5, max: 0, step: 0.1, defaultValue: -2.5 },
          { key: "camber_lr", label: "LR Camber", unit: "deg", min: -5, max: 0, step: 0.1, defaultValue: -2.0 },
          { key: "camber_rr", label: "RR Camber", unit: "deg", min: -5, max: 0, step: 0.1, defaultValue: -1.5 },
          { key: "caster", label: "Caster", unit: "deg", min: 3, max: 9, step: 0.1, defaultValue: 6.0 },
          { key: "toe_front", label: "Front Toe", unit: "in", min: -0.125, max: 0.250, step: 0.0625, defaultValue: 0.0625 },
          { key: "toe_rear", label: "Rear Toe", unit: "in", min: -0.125, max: 0.250, step: 0.0625, defaultValue: 0.000 },
        ],
      },
      {
        group: "Aero",
        params: [
          { key: "tape", label: "Grille Tape", unit: "%", min: 0, max: 100, step: 5, defaultValue: 50 },
          { key: "nose_weight", label: "Nose Weight", unit: "%", min: 48, max: 56, step: 0.5, defaultValue: 52 },
        ],
      },
      {
        group: "Brakes",
        params: [
          { key: "brake_bias", label: "Brake Bias (Front)", unit: "%", min: 50, max: 80, step: 0.5, defaultValue: 65 },
        ],
      },
      {
        group: "Gearing",
        params: [
          { key: "final_drive", label: "Final Drive Ratio", unit: ":1", min: 3.00, max: 5.50, step: 0.01, defaultValue: 4.10 },
        ],
      },
    ],
  },
  {
    id: "xfinity",
    name: "NASCAR Xfinity Series",
    series: "NASCAR Xfinity Series (Class B)",
    description:
      "The Xfinity Series car uses a more traditional solid rear axle setup with a truck arm rear suspension. Features adjustable track bar, wedge bolts, and traditional sway bar setups. Open setups allow full garage access.",
    parameters: [
      {
        group: "Tires",
        params: [
          { key: "tire_pressure_lf", label: "LF Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 24 },
          { key: "tire_pressure_rf", label: "RF Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 34 },
          { key: "tire_pressure_lr", label: "LR Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 22 },
          { key: "tire_pressure_rr", label: "RR Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 32 },
        ],
      },
      {
        group: "Springs",
        params: [
          { key: "spring_rate_lf", label: "LF Spring Rate", unit: "lbs/in", min: 100, max: 700, step: 25, defaultValue: 350 },
          { key: "spring_rate_rf", label: "RF Spring Rate", unit: "lbs/in", min: 100, max: 700, step: 25, defaultValue: 350 },
          { key: "spring_rate_lr", label: "LR Spring Rate", unit: "lbs/in", min: 100, max: 450, step: 25, defaultValue: 200 },
          { key: "spring_rate_rr", label: "RR Spring Rate", unit: "lbs/in", min: 100, max: 450, step: 25, defaultValue: 225 },
        ],
      },
      {
        group: "Shocks",
        params: [
          { key: "shock_lf_comp", label: "LF Shock Compression", unit: "clicks", min: 1, max: 15, step: 1, defaultValue: 6 },
          { key: "shock_lf_reb", label: "LF Shock Rebound", unit: "clicks", min: 1, max: 15, step: 1, defaultValue: 6 },
          { key: "shock_rf_comp", label: "RF Shock Compression", unit: "clicks", min: 1, max: 15, step: 1, defaultValue: 6 },
          { key: "shock_rf_reb", label: "RF Shock Rebound", unit: "clicks", min: 1, max: 15, step: 1, defaultValue: 6 },
          { key: "shock_lr_comp", label: "LR Shock Compression", unit: "clicks", min: 1, max: 15, step: 1, defaultValue: 5 },
          { key: "shock_lr_reb", label: "LR Shock Rebound", unit: "clicks", min: 1, max: 15, step: 1, defaultValue: 5 },
          { key: "shock_rr_comp", label: "RR Shock Compression", unit: "clicks", min: 1, max: 15, step: 1, defaultValue: 5 },
          { key: "shock_rr_reb", label: "RR Shock Rebound", unit: "clicks", min: 1, max: 15, step: 1, defaultValue: 5 },
        ],
      },
      {
        group: "Chassis",
        params: [
          { key: "track_bar_height", label: "Track Bar Height (Right)", unit: "in", min: 7, max: 13, step: 0.25, defaultValue: 10.0 },
          { key: "cross_weight", label: "Cross Weight (Wedge)", unit: "%", min: 46, max: 58, step: 0.1, defaultValue: 51.5 },
          { key: "sway_bar_front", label: "Front Sway Bar Diameter", unit: "in", min: 0.875, max: 1.500, step: 0.0625, defaultValue: 1.250 },
          { key: "ride_height_lf", label: "LF Ride Height", unit: "in", min: 4.0, max: 7.0, step: 0.0625, defaultValue: 5.0 },
          { key: "ride_height_rf", label: "RF Ride Height", unit: "in", min: 4.0, max: 7.0, step: 0.0625, defaultValue: 5.0 },
          { key: "ride_height_lr", label: "LR Ride Height", unit: "in", min: 5.0, max: 8.0, step: 0.0625, defaultValue: 6.0 },
          { key: "ride_height_rr", label: "RR Ride Height", unit: "in", min: 5.0, max: 8.0, step: 0.0625, defaultValue: 6.0 },
        ],
      },
      {
        group: "Alignment",
        params: [
          { key: "camber_lf", label: "LF Camber", unit: "deg", min: -5, max: 0, step: 0.1, defaultValue: -3.5 },
          { key: "camber_rf", label: "RF Camber", unit: "deg", min: -5, max: 0, step: 0.1, defaultValue: -3.0 },
          { key: "camber_lr", label: "LR Camber", unit: "deg", min: -3, max: 0, step: 0.1, defaultValue: -1.5 },
          { key: "camber_rr", label: "RR Camber", unit: "deg", min: -3, max: 0, step: 0.1, defaultValue: -0.5 },
          { key: "caster", label: "Caster", unit: "deg", min: 2, max: 8, step: 0.1, defaultValue: 5.5 },
          { key: "toe_front", label: "Front Toe", unit: "in", min: -0.125, max: 0.250, step: 0.0625, defaultValue: 0.0625 },
          { key: "toe_rear", label: "Rear Toe", unit: "in", min: -0.125, max: 0.250, step: 0.0625, defaultValue: 0.000 },
        ],
      },
      {
        group: "Aero",
        params: [
          { key: "tape", label: "Grille Tape", unit: "%", min: 0, max: 100, step: 5, defaultValue: 45 },
        ],
      },
      {
        group: "Brakes",
        params: [
          { key: "brake_bias", label: "Brake Bias (Front)", unit: "%", min: 50, max: 80, step: 0.5, defaultValue: 62 },
        ],
      },
      {
        group: "Gearing",
        params: [
          { key: "gear_1", label: "1st Gear", unit: ":1", min: 2.50, max: 3.50, step: 0.01, defaultValue: 2.94 },
          { key: "gear_2", label: "2nd Gear", unit: ":1", min: 1.70, max: 2.30, step: 0.01, defaultValue: 1.94 },
          { key: "gear_3", label: "3rd Gear", unit: ":1", min: 1.30, max: 1.70, step: 0.01, defaultValue: 1.46 },
          { key: "gear_4", label: "4th Gear", unit: ":1", min: 1.00, max: 1.30, step: 0.01, defaultValue: 1.10 },
          { key: "final_drive", label: "Final Drive Ratio", unit: ":1", min: 3.00, max: 5.50, step: 0.01, defaultValue: 4.10 },
        ],
      },
    ],
  },
  {
    id: "truck",
    name: "NASCAR Craftsman Truck Series",
    series: "NASCAR Craftsman Truck Series (Class C)",
    description:
      "The Truck Series features a traditional solid rear axle, leaf spring rear suspension setup similar to the Xfinity car but with truck-specific characteristics. Generally more forgiving and a great platform for learning oval setup fundamentals.",
    parameters: [
      {
        group: "Tires",
        params: [
          { key: "tire_pressure_lf", label: "LF Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 24 },
          { key: "tire_pressure_rf", label: "RF Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 34 },
          { key: "tire_pressure_lr", label: "LR Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 22 },
          { key: "tire_pressure_rr", label: "RR Tire Pressure", unit: "psi", min: 14, max: 50, step: 0.5, defaultValue: 32 },
        ],
      },
      {
        group: "Springs",
        params: [
          { key: "spring_rate_lf", label: "LF Spring Rate", unit: "lbs/in", min: 100, max: 600, step: 25, defaultValue: 300 },
          { key: "spring_rate_rf", label: "RF Spring Rate", unit: "lbs/in", min: 100, max: 600, step: 25, defaultValue: 300 },
          { key: "spring_rate_lr", label: "LR Spring Rate", unit: "lbs/in", min: 100, max: 400, step: 25, defaultValue: 175 },
          { key: "spring_rate_rr", label: "RR Spring Rate", unit: "lbs/in", min: 100, max: 400, step: 25, defaultValue: 200 },
        ],
      },
      {
        group: "Shocks",
        params: [
          { key: "shock_lf_comp", label: "LF Shock Compression", unit: "clicks", min: 1, max: 12, step: 1, defaultValue: 5 },
          { key: "shock_lf_reb", label: "LF Shock Rebound", unit: "clicks", min: 1, max: 12, step: 1, defaultValue: 5 },
          { key: "shock_rf_comp", label: "RF Shock Compression", unit: "clicks", min: 1, max: 12, step: 1, defaultValue: 5 },
          { key: "shock_rf_reb", label: "RF Shock Rebound", unit: "clicks", min: 1, max: 12, step: 1, defaultValue: 5 },
          { key: "shock_lr_comp", label: "LR Shock Compression", unit: "clicks", min: 1, max: 12, step: 1, defaultValue: 4 },
          { key: "shock_lr_reb", label: "LR Shock Rebound", unit: "clicks", min: 1, max: 12, step: 1, defaultValue: 4 },
          { key: "shock_rr_comp", label: "RR Shock Compression", unit: "clicks", min: 1, max: 12, step: 1, defaultValue: 4 },
          { key: "shock_rr_reb", label: "RR Shock Rebound", unit: "clicks", min: 1, max: 12, step: 1, defaultValue: 4 },
        ],
      },
      {
        group: "Chassis",
        params: [
          { key: "track_bar_height", label: "Track Bar Height (Right)", unit: "in", min: 7, max: 13, step: 0.25, defaultValue: 10.0 },
          { key: "cross_weight", label: "Cross Weight (Wedge)", unit: "%", min: 46, max: 58, step: 0.1, defaultValue: 51.0 },
          { key: "sway_bar_front", label: "Front Sway Bar Diameter", unit: "in", min: 0.875, max: 1.375, step: 0.0625, defaultValue: 1.125 },
          { key: "ride_height_lf", label: "LF Ride Height", unit: "in", min: 4.0, max: 7.0, step: 0.0625, defaultValue: 5.0 },
          { key: "ride_height_rf", label: "RF Ride Height", unit: "in", min: 4.0, max: 7.0, step: 0.0625, defaultValue: 5.0 },
          { key: "ride_height_lr", label: "LR Ride Height", unit: "in", min: 5.0, max: 8.0, step: 0.0625, defaultValue: 6.25 },
          { key: "ride_height_rr", label: "RR Ride Height", unit: "in", min: 5.0, max: 8.0, step: 0.0625, defaultValue: 6.25 },
        ],
      },
      {
        group: "Alignment",
        params: [
          { key: "camber_lf", label: "LF Camber", unit: "deg", min: -5, max: 0, step: 0.1, defaultValue: -3.5 },
          { key: "camber_rf", label: "RF Camber", unit: "deg", min: -5, max: 0, step: 0.1, defaultValue: -2.5 },
          { key: "camber_lr", label: "LR Camber", unit: "deg", min: -3, max: 0, step: 0.1, defaultValue: -1.0 },
          { key: "camber_rr", label: "RR Camber", unit: "deg", min: -3, max: 0, step: 0.1, defaultValue: -0.5 },
          { key: "caster", label: "Caster", unit: "deg", min: 2, max: 8, step: 0.1, defaultValue: 5.0 },
          { key: "toe_front", label: "Front Toe", unit: "in", min: -0.125, max: 0.250, step: 0.0625, defaultValue: 0.0625 },
          { key: "toe_rear", label: "Rear Toe", unit: "in", min: -0.125, max: 0.250, step: 0.0625, defaultValue: 0.000 },
        ],
      },
      {
        group: "Aero",
        params: [
          { key: "tape", label: "Grille Tape", unit: "%", min: 0, max: 100, step: 5, defaultValue: 40 },
        ],
      },
      {
        group: "Brakes",
        params: [
          { key: "brake_bias", label: "Brake Bias (Front)", unit: "%", min: 50, max: 80, step: 0.5, defaultValue: 60 },
        ],
      },
      {
        group: "Gearing",
        params: [
          { key: "gear_1", label: "1st Gear", unit: ":1", min: 2.50, max: 3.50, step: 0.01, defaultValue: 2.94 },
          { key: "gear_2", label: "2nd Gear", unit: ":1", min: 1.70, max: 2.30, step: 0.01, defaultValue: 1.94 },
          { key: "gear_3", label: "3rd Gear", unit: ":1", min: 1.30, max: 1.70, step: 0.01, defaultValue: 1.46 },
          { key: "gear_4", label: "4th Gear", unit: ":1", min: 1.00, max: 1.30, step: 0.01, defaultValue: 1.10 },
          { key: "final_drive", label: "Final Drive Ratio", unit: ":1", min: 3.00, max: 5.50, step: 0.01, defaultValue: 4.10 },
        ],
      },
    ],
  },
];

export function getCarById(id: CarId): CarDefinition | undefined {
  return cars.find((c) => c.id === id);
}

export function getDefaultSetupValues(car: CarDefinition): Record<string, number> {
  const values: Record<string, number> = {};
  for (const group of car.parameters) {
    for (const param of group.params) {
      values[param.key] = param.defaultValue;
    }
  }
  return values;
}
