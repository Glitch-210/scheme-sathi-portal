import { useState, useEffect } from 'react';

const IntroLoader = ({ onComplete }) => {
    // Stage 0: S (English) -> Stage 1: સ (Gujarati) -> Stage 2: स (Hindi) -> Stage 3: S (English) -> Finish
    const [stage, setStage] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const characters = [
        { char: 'S', lang: 'en', label: 'English' },
        { char: 'સ', lang: 'gu', label: 'Gujarati' },
        { char: 'स', lang: 'hi', label: 'Hindi' },
        { char: 'S', lang: 'en', label: 'English' }
    ];

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            // Skip animation if reduced motion is preferred
            setIsVisible(false);
            onComplete();
            return;
        }

        // Failsafe: Auto-skip after 4.5 seconds
        const failsafeTimeout = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
        }, 4500);

        // Sequence logic
        const sequence = async () => {
            // Stage 0 is already set initially
            // Wait 800ms, fade out
            await new Promise(r => setTimeout(r, 800));
            setStage(1); // Gujarati

            await new Promise(r => setTimeout(r, 800));
            setStage(2); // Hindi

            await new Promise(r => setTimeout(r, 800));
            setStage(3); // English Final

            await new Promise(r => setTimeout(r, 1000)); // Hold final S a bit longer
            setIsVisible(false); // Trigger exit animation

            await new Promise(r => setTimeout(r, 500)); // Wait for exit animation
            onComplete();
            clearTimeout(failsafeTimeout);
        };

        sequence();

        return () => clearTimeout(failsafeTimeout);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] bg-background flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="status"
            aria-label="Loading Scheme Sathi Portal"
        >
            <div className="relative flex flex-col items-center">
                {/* Main Character */}
                <div key={stage} className="text-8xl md:text-9xl font-bold text-primary animate-in fade-in zoom-in duration-500 fill-mode-forwards">
                    {characters[stage].char}
                </div>

                {/* Language Label (Subtle) */}
                <div key={`label-${stage}`} className="mt-4 text-sm text-muted-foreground font-medium uppercase tracking-widest animate-in slide-in-from-bottom-2 fade-in duration-500">
                    {characters[stage].label}
                </div>

                {/* Loading Bar */}
                <div className="absolute -bottom-12 w-24 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress-indeterminate origin-left" />
                </div>
            </div>
        </div>
    );
};

export default IntroLoader;
