import { createElement } from "react";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  /** Element å rendre som (default h1). */
  as?: "h1" | "h2" | "p" | "span";
};

/**
 * Avslører tekst ord-for-ord med blur + løft. Beholder \n som linjeskift.
 *
 * Bevisst ren CSS, ikke Motion. Den forrige versjonen satte hvert ord til
 * opacity 0 og lot JS animere det opp; når den animasjonen ikke kom i gang
 * ble H1-en på forsiden stående permanent usynlig. En CSS-animasjon med
 * `animation-fill-mode: both` ender alltid i synlig tilstand — kjører ikke
 * animasjonen, står teksten der uansett. Feiler synlig, ikke usynlig.
 *
 * Keyframes og reduced-motion-håndtering ligger i globals.css (.word-reveal).
 */
export default function WordReveal({ text, className = "", delay = 0, as = "h1" }: Props) {
  const lines = text.split("\n");
  let wordIndex = 0;

  return createElement(
    as,
    { className: `word-reveal ${className}`, "aria-label": text },
    lines.map((line, li) => (
      <span key={li} className="block">
        {line.split(" ").map((word) => {
          const idx = wordIndex++;
          return (
            // Mellomrommet ligger utenfor inline-block-wrapperen. Inni den blir
            // en etterfølgende blank kollapset bort, og ordene klistrer seg
            // sammen ("Alttilditt").
            <span key={idx}>
              <span className="inline-block align-bottom">
                <span
                  className="word-reveal__ord inline-block will-change-transform"
                  style={{ animationDelay: `${(delay + idx * 0.055).toFixed(3)}s` }}
                >
                  {word}
                </span>
              </span>{" "}
            </span>
          );
        })}
      </span>
    )),
  );
}
