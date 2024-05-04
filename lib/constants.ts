export const Constants = [
  { value: "PLN", label: "zł PLN", locale: "pl-PL" },
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "GBP", label: "£ Pound", locale: "en-GB" },
];

export type Currency = (typeof Constants)[0];

export const PRICING_CARDS = [
  {
    planType: "Free Plan",
    price: "0",
    description: "Limited block trials  for teams",
    highlightFeature: "",
    freatures: [
      "Unlimited blocks for teams",
      "Unlimited file uploads",
      "30 day page history",
      "Invite 2 guests",
    ],
  },
  {
    planType: "Pro Plan",
    price: "12.99",
    description: "Billed annually. $17 billed monthly",
    highlightFeature: "Everything in free +",
    freatures: [
      "Unlimited blocks for teams",
      "Unlimited file uploads",
      "1 year day page history",
      "Invite 10 guests",
    ],
  },
];

export const PRICING_PLANS = { proplan: "Pro Plan", freeplan: "Free Plan" };

export const MAX_FOLDERS_FREE_PLAN = 3;
