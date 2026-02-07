import { fetchExercisesByMuscleGroup } from "@/lib/exercise-repository";

// Hardcoded fallback for when Supabase is not configured or hasn't loaded yet
const EXERCISE_SUGGESTIONS: Record<string, string[]> = {
  PIERNA: [
    "Sentadilla hack",
    "Sentadilla libre",
    "Sentadilla bulgara",
    "Prensa",
    "Prensa 45",
    "Extension de rodilla",
    "Extension de rodilla pausa 3 segundos arriba",
    "Curl femoral acostado",
    "Curl femoral sentado",
    "Peso muerto rumano",
    "Peso muerto convencional",
    "Hip thrust",
    "Aductores",
    "Abductores",
    "Pantorrilla sentado",
    "Pantorrilla de pie",
    "Pantorrilla en prensa",
    "Zancada",
    "Step up",
    "Peldano o step up",
    "Desplante",
    "Good morning",
    "Gluteo en polea",
    "Gluteo en maquina",
  ],
  PECHO: [
    "Press banca plano",
    "Press banca inclinado",
    "Press banca declinado",
    "Press mancuernas plano",
    "Press mancuernas inclinado",
    "Aperturas mancuernas",
    "Aperturas en polea",
    "Crossover",
    "Pec deck",
    "Fondos en paralelas",
    "Pullover",
    "Press en maquina",
  ],
  ESPALDA: [
    "Jalon al pecho",
    "Jalon tras nuca",
    "Jalon agarre neutro",
    "Remo con barra",
    "Remo con mancuerna",
    "Remo en maquina",
    "Remo en polea baja",
    "Remo T",
    "Dominadas",
    "Dominadas asistidas",
    "Pullover en polea",
    "Face pull",
    "Encogimientos",
    "Peso muerto",
    "Hiperextensiones",
  ],
  HOMBRO: [
    "Press militar",
    "Press militar con mancuernas",
    "Press Arnold",
    "Elevaciones laterales",
    "Elevaciones laterales en polea",
    "Elevaciones frontales",
    "Pajaros",
    "Pajaros en maquina",
    "Face pull",
    "Encogimientos",
    "Press en maquina",
    "Remo al menton",
  ],
  BRAZO: [
    "Curl bicep barra",
    "Curl bicep mancuerna",
    "Curl martillo",
    "Curl predicador",
    "Curl concentrado",
    "Curl en polea",
    "Curl spider",
    "Extension tricep polea",
    "Extension tricep cuerda",
    "Fondos en paralelas",
    "Press frances",
    "Patada de tricep",
    "Copa con mancuerna",
    "Curl de muneca",
  ],
  GENERAL: [
    "Plancha",
    "Crunch",
    "Crunch en polea",
    "Elevacion de piernas",
    "Russian twist",
    "Ab wheel",
    "Mountain climbers",
    "Burpees",
  ],
};

// Cache for Supabase data
let supabaseExercises: Record<string, string[]> | null = null;
let fetchPromise: Promise<void> | null = null;

function initializeCache(): void {
  if (fetchPromise) return;
  fetchPromise = fetchExercisesByMuscleGroup()
    .then((data) => {
      if (Object.keys(data).length > 0) {
        supabaseExercises = data;
      }
    })
    .catch(() => {
      // Silently fail, use hardcoded fallback
    });
}

export function getSuggestions(muscleGroup: string, query: string): string[] {
  initializeCache();

  const source = supabaseExercises ?? EXERCISE_SUGGESTIONS;
  const normalizedGroup = muscleGroup.toUpperCase();
  const normalizedQuery = query.toLowerCase();

  const groupExercises = source[normalizedGroup] ?? [];
  const generalExercises = source["GENERAL"] ?? [];
  const allExercises = [...groupExercises, ...generalExercises];

  if (!normalizedQuery) {
    return allExercises;
  }

  return allExercises.filter((exercise) =>
    exercise.toLowerCase().includes(normalizedQuery)
  );
}

export { EXERCISE_SUGGESTIONS };
