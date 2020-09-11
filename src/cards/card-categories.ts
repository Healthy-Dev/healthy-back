export enum CardCategories {
  ALIMENTACION = 'Alimentación',
  DEPORTE = 'Deporte',
  ESPACIO_DE_TRABAJO = 'Espacio de trabajo',
  RECETA = 'Receta',
  SALUD_MENTAL = 'Salud mental',
  RUTINA = 'Rutina',
  VARIOS = 'Varios',
}

export function getAllowedCategories(): string[] {
  const allowedCategories = [];
  for (const [propertyKey, propertyValue] of Object.entries(CardCategories)) {
    if (!Number.isNaN(Number(propertyKey))) {
      continue;
    }
    allowedCategories.push(propertyValue);
  }
  return allowedCategories;
}
