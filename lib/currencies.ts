export const Currencies = [
  { value: "PLN", label: "zł PLN", locale: "pl-PL" },
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "GBP", label: "£ Pound", locale: "en-GB" },
];

export type Currency = (typeof Currencies)[0];
