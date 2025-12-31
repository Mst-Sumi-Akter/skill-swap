import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, id, ...props }, ref) => {
        const generatedId = React.useId();
        const inputId = id || generatedId;

        return (
            <div className="relative">
                <input
                    type={type}
                    id={inputId}
                    className={cn(
                        "peer flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    placeholder={label} // Placeholder needed for :placeholder-shown trick
                    ref={ref}
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 bg-background px-1"
                >
                    {label}
                </label>
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
