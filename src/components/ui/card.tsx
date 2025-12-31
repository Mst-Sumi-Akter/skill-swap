"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    spotlight?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, spotlight = false, ...props }, ref) => {
        const divRef = useRef<HTMLDivElement>(null);
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const [opacity, setOpacity] = useState(0);

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!divRef.current || !spotlight) return;

            const div = divRef.current;
            const rect = div.getBoundingClientRect();

            setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };

        const handleMouseEnter = () => {
            setOpacity(1);
        };

        const handleMouseLeave = () => {
            setOpacity(0);
        };

        return (
            <div
                ref={divRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn(
                    "relative rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden",
                    className
                )}
                {...props}
            >
                {spotlight && (
                    <div
                        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                        style={{
                            opacity,
                            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(124, 58, 237, 0.1), transparent 40%)`,
                        }}
                    />
                )}
                <div className="relative">{children}</div>
            </div>
        );
    }
);
Card.displayName = "Card";

export { Card };
