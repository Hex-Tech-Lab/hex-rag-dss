// @third-party
import * as TablerIcons from '@tabler/icons-react';

/***************************  DYNAMIC - TABLER ICONS - TYPES  ***************************/

interface Props {
  name: string;
  size?: number;
  color?: string;
  stroke?: number;
}

/***************************  DYNAMIC - TABLER ICONS  ***************************/

export default function DynamicIcon({ name, size = 24, color = 'currentColor', stroke = 2 }: Props) {
  // @ts-expect-error - Dynamically get the icon component based on the `name` prop
  const IconComponent = TablerIcons[name];

  // If the provided `name` does not match any icon in TablerIcons, return null to avoid rendering errors
  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} color={color} stroke={stroke} />;
}
