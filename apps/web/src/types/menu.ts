export interface NavItem {
  id: string;
  title: string;
  type: 'item' | 'group' | 'collapse';
  url?: string;
  icon?: string;
  children?: NavItem[];
  disabled?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
}

export interface Menu {
  items: NavItem[];
}
