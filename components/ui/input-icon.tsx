// Dependencies: pnpm install lucide-react

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";

interface InputIconProps {
  label?: string;
  id?: string;
  icon: string;
  placeholder?: string;
  type?: string;
  className?: string;
}

export default function InputIcon({
  label,
  id = "input",
  icon,
  placeholder,
  type = "text",
  className,
}: InputIconProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          className={`peer pe-9 ${className}`}
          placeholder={placeholder}
          type={type}
        />
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Icon icon={icon} width={16} height={16} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
