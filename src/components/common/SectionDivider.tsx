'use client';

type Variant = 'wave' | 'curve' | 'angle' | 'soft';

type Props = {
  /** Choose a shape */
  variant?: Variant;
  /** Hex/rgb/css var. This is the FILL color of the divider (should match the next section bg) */
  color?: string;
  /** Flip vertically to transition down/up */
  flip?: boolean;
  /** Height in px */
  height?: number;
  /** Add extra class */
  className?: string;
  /** aria-label for accessibility (optional) */
  label?: string;
};

export default function SectionDivider({
  variant = 'wave',
  color = 'var(--divider-next, #fff)',
  flip = false,
  height = 80,
  className,
  label = 'Section divider',
}: Props) {
  const common = {
    role: 'img',
    'aria-label': label,
    style: {
      display: 'block',
      width: '100%',
      height,
      transform: flip ? 'rotate(180deg)' : undefined,
    } as React.CSSProperties,
  };

  if (variant === 'angle') {
    return (
      <svg {...common} viewBox="0 0 100 10" preserveAspectRatio="none" className={className}>
        <polygon points="0,0 100,10 100,10 0,10" fill={color} />
      </svg>
    );
  }

  if (variant === 'curve') {
    return (
      <svg {...common} viewBox="0 0 1440 120" preserveAspectRatio="none" className={className}>
        <path d="M0,52 C360,120 1080,-16 1440,52 L1440,120 L0,120 Z" fill={color} />
      </svg>
    );
  }

  if (variant === 'soft') {
    return (
      <svg {...common} viewBox="0 0 1440 120" preserveAspectRatio="none" className={className}>
        <path d="M0,0 C300,80 1140,40 1440,100 L1440,120 L0,120 Z" fill={color} opacity="0.9" />
      </svg>
    );
  }

  // default: wave
  return (
    <svg {...common} viewBox="0 0 1440 120" preserveAspectRatio="none" className={className}>
      <path d="M0,32 C240,112 1200,-16 1440,64 L1440,120 L0,120 Z" fill={color} />
    </svg>
  );
}
