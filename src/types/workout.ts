// -- Rest Time Options --
const REST_TIME = {
  THIRTY_SEC: "30 SEG",
  ONE_MIN: "1 MIN",
  ONE_TWO_MIN: "1-2 MIN",
  TWO_MIN: "2 MIN",
  TWO_THREE_MIN: "2-3 MIN",
  THREE_MIN: "3 MIN",
} as const;

type RestTime = (typeof REST_TIME)[keyof typeof REST_TIME];

// -- RIR (Reps In Reserve) --
const RIR_VALUES = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
} as const;

type RirValue = (typeof RIR_VALUES)[keyof typeof RIR_VALUES];

// -- RPE (Rate of Perceived Exertion) --
const RPE_VALUES = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
} as const;

type RpeValue = (typeof RPE_VALUES)[keyof typeof RPE_VALUES];

// -- Series Options --
const SERIES_VALUES = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
} as const;

type SeriesValue = (typeof SERIES_VALUES)[keyof typeof SERIES_VALUES];

// -- Entities --
interface Exercise {
  id: string;
  name: string;
  series: SeriesValue;
  reps: number;
  restTime: RestTime;
  rir: RirValue;
  rpe: RpeValue;
}

interface CardioBlock {
  description: string;
  note: string;
}

interface WorkoutDay {
  id: string;
  dayNumber: number;
  dayLabel: string;
  muscleGroup: string;
  exercises: Exercise[];
  cardio: CardioBlock;
}

interface WorkoutWeek {
  id: string;
  weekNumber: number;
  days: WorkoutDay[];
}

interface WorkoutPlan {
  id: string;
  title: string;
  weeks: WorkoutWeek[];
  createdAt: string;
}

// -- Dropdown Options Arrays --
const REST_TIME_OPTIONS: RestTime[] = Object.values(REST_TIME);
const RIR_OPTIONS: RirValue[] = Object.values(RIR_VALUES);
const RPE_OPTIONS: RpeValue[] = Object.values(RPE_VALUES);
const SERIES_OPTIONS: SeriesValue[] = Object.values(SERIES_VALUES);
const REPS_OPTIONS: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

// -- Default Values --
const DEFAULT_CARDIO: CardioBlock = {
  description: "",
  note: "No te saltes el cardio, es un complemento importante para tu proceso.",
};

const DEFAULT_EXERCISE: Omit<Exercise, "id"> = {
  name: "",
  series: 3,
  reps: 10,
  restTime: REST_TIME.TWO_MIN,
  rir: 2,
  rpe: 8,
};

export {
  REST_TIME,
  RIR_VALUES,
  RPE_VALUES,
  SERIES_VALUES,
  REST_TIME_OPTIONS,
  RIR_OPTIONS,
  RPE_OPTIONS,
  SERIES_OPTIONS,
  REPS_OPTIONS,
  DEFAULT_CARDIO,
  DEFAULT_EXERCISE,
};

export type {
  RestTime,
  RirValue,
  RpeValue,
  SeriesValue,
  Exercise,
  CardioBlock,
  WorkoutDay,
  WorkoutWeek,
  WorkoutPlan,
};
