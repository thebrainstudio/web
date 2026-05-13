/**
 * Page-transition wrapper. Each route gets a fresh template instance
 * (Next App Router convention), so a CSS keyframe fades up the new
 * content. Pure CSS so the animation isn't tangled with React 19 strict
 * mode + Framer Motion mount races (which were rendering the wrapper
 * with display: none on first load).
 *
 * See `.route-enter` keyframe in globals.css.
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="route-enter">{children}</div>;
}
