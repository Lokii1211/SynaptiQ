'use client';
import Link from 'next/link';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    href?: string;
    className?: string;
}

const sizes = {
    sm: { icon: 24, text: 'text-sm', gap: 'gap-1.5' },
    md: { icon: 32, text: 'text-lg', gap: 'gap-2' },
    lg: { icon: 40, text: 'text-xl', gap: 'gap-2.5' },
    xl: { icon: 56, text: 'text-3xl', gap: 'gap-3' },
};

function LogoMark({ size = 32 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="50%" stopColor="#6D28D9" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <linearGradient id="logoGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
            </defs>
            {/* Rounded square background */}
            <rect width="48" height="48" rx="12" fill="url(#logoGrad)" />

            {/* S + T merged geometric mark */}
            {/* Upward arrow / compass needle — symbolizes career direction */}
            <path
                d="M24 8L32 20H28V28H20V20H16L24 8Z"
                fill="white"
                opacity="0.95"
            />
            {/* Base bar — symbolizes foundation/skills */}
            <rect x="16" y="31" width="16" height="3.5" rx="1.75" fill="white" opacity="0.7" />
            {/* Bottom dots — represent the "10" in Mentixy / scoring */}
            <circle cx="18.5" cy="39" r="2" fill="white" opacity="0.5" />
            <circle cx="24" cy="39" r="2" fill="url(#logoGradLight)" opacity="0.8" />
            <circle cx="29.5" cy="39" r="2" fill="white" opacity="0.5" />
        </svg>
    );
}

export function Logo({ size = 'md', showText = true, href, className = '' }: LogoProps) {
    const s = sizes[size];

    const content = (
        <div className={`flex items-center ${s.gap} ${className}`}>
            <LogoMark size={s.icon} />
            {showText && (
                <span className={`${s.text} font-extrabold tracking-tight`} style={{ fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}>
                    <span className="text-slate-900">Skill</span>
                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Ten</span>
                </span>
            )}
        </div>
    );

    if (href) {
        return <Link href={href} className="inline-flex">{content}</Link>;
    }

    return content;
}

export { LogoMark };
