export const EVENT_TYPE_LABELS: Record<string, string> = {
  club: "Клубный",
  irregular: "Нерегулярный",
  out_of_town: "Загородный",
  city: "Городской",
};

export function formatEventType(type: string | null | undefined): string {
  if (!type) return "";
  return EVENT_TYPE_LABELS[type] || type;
}
