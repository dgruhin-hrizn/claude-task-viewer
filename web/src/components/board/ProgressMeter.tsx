import * as ProgressPrimitive from '@radix-ui/react-progress';

export function ProgressMeter({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <ProgressPrimitive.Root
        value={value}
        aria-label={label}
        className="h-0.5 w-[120px] overflow-hidden rounded bg-border max-md:hidden"
      >
        <ProgressPrimitive.Indicator
          className="h-full bg-primary transition-transform"
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </ProgressPrimitive.Root>
      <span className="text-xs text-primary">{value}%</span>
    </div>
  );
}
