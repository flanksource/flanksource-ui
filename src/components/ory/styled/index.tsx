export interface DocsButtonProps {
  title: string;
  href?: string;
  onClick?: () => void;
  testid: string;
  disabled?: boolean;
  unresponsive?: boolean;
}
