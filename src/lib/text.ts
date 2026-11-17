const WORDS = ['Cero', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez', 'Once', 'Doce'] as const;

/** 8 → "Ocho" (para titulares); si el número es grande, devuelve el numeral. */
export function numberWord(n: number): string {
  return WORDS[n] ?? String(n);
}
