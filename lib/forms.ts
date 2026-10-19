/** Pakistani mobile: 03xx xxxxxxx or +92 3xx xxxxxxx, spaces or dashes allowed. */
export const PHONE_FIELD = {
  type: "tel",
  autoComplete: "tel",
  inputMode: "tel",
  pattern: String.raw`(\+92|0)[\s\-]?3[0-9]{2}[\s\-]?[0-9]{7}`,
  hint: "e.g. 0311 1104464 or +92 311 1104464",
  error: "Use a Pakistani mobile number like 0311 1104464.",
} as const;
