import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-visible");
            observer.unobserve(node);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "center",
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("mb-12 md:mb-16", align === "center" ? "text-center" : "text-left")}>
      {kicker && <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{kicker}</p>}
      <h2 className={cn("font-display font-medium tracking-tight text-foreground md:text-5xl", kicker ? "mt-4 text-3xl" : "text-3xl md:text-4xl")}>
        {title}
      </h2>
      <span className={cn("gold-rule mt-5", align === "center" && "mx-auto block")} />
      {subtitle && (
        <p className={cn("mt-5 max-w-2xl text-base text-muted-foreground md:text-lg", align === "center" && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
