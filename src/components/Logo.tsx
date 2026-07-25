// Inline SVG brand mark — two overlapping chat bubbles ("dual minds").
// Self-contained (no image asset), so it renders crisply at any size and
// never breaks on a missing file.
const Logo = ({ size = 40 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Back bubble (green) */}
    <rect x="30" y="7" width="27" height="22" rx="7" fill="#10b981" />
    <path d="M39 29 v8 l8 -8 z" fill="#10b981" />
    {/* Front bubble (indigo) */}
    <rect x="7" y="19" width="35" height="29" rx="8" fill="#4f46e5" />
    <path d="M18 48 v9 l10 -9 z" fill="#4f46e5" />
    {/* "D" */}
    <text
      x="24.5"
      y="41"
      fontSize="21"
      fontWeight="800"
      fill="#ffffff"
      textAnchor="middle"
      fontFamily="Inter, system-ui, sans-serif"
    >
      D
    </text>
  </svg>
);

export default Logo;
