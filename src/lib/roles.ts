/*
  The "Who are you?" options.

  Shared so the form renders the same list the server validates against, and
  so the Google Sheet gets the readable label rather than the slug.
*/

export const ROLE_OPTIONS = [
  { value: "c-level",     label: "C-Level / Executive" },
  { value: "it-devops",   label: "IT / DevOps" },
  { value: "engineering", label: "Engineering" },
  { value: "people-hr",   label: "People / HR" },
  { value: "other",       label: "Other" },
] as const;

export type RoleValue = (typeof ROLE_OPTIONS)[number]["value"];

/**
 * Maps a submitted role slug to its label. Returns an empty string for a
 * missing or unrecognised value — the field is optional, and a tampered
 * value shouldn't land in the sheet verbatim.
 */
export function roleLabel(value: string | undefined): string {
  return ROLE_OPTIONS.find((option) => option.value === value)?.label ?? "";
}
