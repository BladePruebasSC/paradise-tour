import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[var(--shadow-ocean)] hover:bg-primary/90 hover:scale-[1.02] transition-[var(--transition-smooth)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground transition-[var(--transition-smooth)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:scale-[1.02] transition-[var(--transition-smooth)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-to-r from-primary to-secondary text-white shadow-[var(--shadow-ocean)] hover:scale-[1.05] transition-[var(--transition-bounce)] font-semibold",
        coral: "bg-accent text-accent-foreground shadow-md hover:bg-accent/90 hover:scale-[1.02] transition-[var(--transition-smooth)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
