import {
  Factory, Building2, Cpu, Wrench, Zap, Lightbulb, ShieldCheck, Battery,
  Activity, Cable, HardHat, Target, Eye, Heart, Award, Users, Clock,
  Briefcase, Star, Settings, Sun, Plug, Bolt, Gauge, Cog, PowerIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Factory, Building2, Cpu, Wrench, Zap, Lightbulb, ShieldCheck, Battery,
  Activity, Cable, HardHat, Target, Eye, Heart, Award, Users, Clock,
  Briefcase, Star, Settings, Sun, Plug, Bolt, Gauge, Cog, Power: PowerIcon,
};

export const ICON_KEYS = Object.keys(ICONS);

export function getIcon(name: string | null | undefined): LucideIcon {
  if (name && ICONS[name]) return ICONS[name];
  return Zap;
}
