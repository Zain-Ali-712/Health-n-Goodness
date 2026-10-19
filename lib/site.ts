/** Brand facts, all from official channels (see research/research.md). */
export const SITE = {
  name: "Health n Goodness",
  short: "HnG",
  tagline: "Freshness. Purity. For Life.", // printed on the green HnG cup (IG DeJxSgeNlZT)
  bio: "Organic. Fresh. Healthy.", // Instagram bio
  intro: "Fresh juices, shakes, smoothies and detox.", // Facebook intro
  uan: "03111104464", // "03-111-104-HNG(464)" on posters
  uanLabel: "03-111-104-HNG (464)",
  email: "healthngoodnesshng@gmail.com",
  bookings: ["0300 1899900", "0332 4324375"], // Live Juice Bar, WhatsApp (IG DYrbIJ2jY5f)
  instagram: "https://www.instagram.com/healthngoodnesshngg",
  instagramHandle: "@healthngoodnesshngg",
  facebook: "https://www.facebook.com/healthngoodness/",
  foodpanda: "https://www.foodpanda.pk/restaurant/fjnu/healthngoodness-model-town",
} as const;

export const waHref = (phone: string) => `https://wa.me/92${phone.replace(/\D/g, "").replace(/^0/, "")}`;
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
