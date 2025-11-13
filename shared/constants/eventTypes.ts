export const EVENT_TYPE_LABELS: Record<string, string> = {
  club: "Клубный",
  irregular: "Внештатный",
  out_of_town: "Выездной",
  city: "Городской",
  athletics: "Атлетикс",
  croissant: "Курасан",
};

export function formatEventType(type: string | null | undefined): string {
  if (!type) return "";
  return EVENT_TYPE_LABELS[type] || type;
}
