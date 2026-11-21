const statusMap = {
  // Positive
  yes: {
    label: "Yes",
    status: "positive",
  },

  usable_seating: {
    label: "Usable seating",
    status: "positive",
  },

  dedicated_lighting: {
    label: "Dedicated lighting",
    status: "positive",
  },

  // Partial
  partial: {
    label: "Partial",
    status: "partial",
  },

  partially: {
    label: "Partially",
    status: "partial",
  },

  partially_visible: {
    label: "Partially visible",
    status: "partial",
  },

  visible_but_outdated: {
    label: "Visible but outdated",
    status: "partial",
  },

  lighting_from_surroundings: {
    label: "Lighting from surroundings",
    status: "partial",
  },

  lighting_from_billboards: {
    label: "Lighting from billboards",
    status: "partial",
  },

  // Negative
  no: {
    label: "No",
    status: "negative",
  },

  no_seating: {
    label: "No seating",
    status: "negative",
  },

  no_light: {
    label: "No light",
    status: "negative",
  },

  broken_seating_hostile_seating: {
    label: "Broken / hostile seating",
    status: "negative",
  },
};

export function getStatus(value) {
  return (
    statusMap[value] || {
      label: value || "—",
      status: "neutral",
    }
  );
}