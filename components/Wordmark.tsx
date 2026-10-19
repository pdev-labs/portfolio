/** Pixel-block wordmark — the site's single bold typographic moment. */
export default function Wordmark({ text }: { text: string }) {
  return (
    <h1 className="wordmark" aria-label={text}>{text}</h1>
  );
}
