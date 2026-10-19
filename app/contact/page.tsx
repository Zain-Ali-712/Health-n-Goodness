import type { Metadata } from "next";
import { EnvelopeSimpleIcon, InstagramLogoIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "@/components/layout/ContactForm";
import { SITE, telHref, waHref } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call the Health n Goodness order line, book a Live Juice Bar for your event or send the team a message.",
};

const CHANNELS = [
  { icon: PhoneIcon, label: "Order line", value: SITE.uanLabel, href: telHref(SITE.uan) },
  { icon: WhatsappLogoIcon, label: "Live Juice Bar bookings", value: SITE.bookings.join(" / "), href: waHref(SITE.bookings[0]) },
  { icon: EnvelopeSimpleIcon, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: InstagramLogoIcon, label: "Instagram", value: SITE.instagramHandle, href: SITE.instagram },
];

export default function ContactPage() {
  return (
    <>
    <PageHero
      title="Say hello"
      intro={<p>For orders, call the branch nearest you or the order line. For events and gifting, message us here.</p>}
      backdrop={{ top: "#7fdcd5", bottom: "#2db3ab", glow: "rgb(220 250 247 / 0.9)", floor: "#a6ece6", rays: true, bokeh: "rgb(235 255 252 / 0.7)" }}
      ink="#0d4a46"
      cups={[
        { src: "/img/hero/mango3.webp", alt: "", h: 92, x: 0 },
        { src: "/img/detox/greenclean.webp", alt: "", h: 90, x: 58, z: 3, rot: 5 },
      ]}
    />
    <div className="container-x pt-14">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <ul className="grid gap-2">
            {CHANNELS.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-[1.25rem] p-3 transition-colors hover:bg-surface"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-green-soft text-green-deep">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-ink">{label}</span>
                    <span className="block truncate font-medium">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </div>
    </div>
    </>
  );
}
