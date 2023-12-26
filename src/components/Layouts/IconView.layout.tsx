type IconSizes = "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";

interface IconViewProps {
  size?: IconSizes;
  Icon: any;
  fill?: string;
}

const iconConfig: Record<IconSizes, string> = {
  lg: "text-lg",
  xl: "text-xl",
  md: "text-md",
  sm: "text-sm",
  xxl: "text-2xl",
  xxxl: "text-3xl",
};

export default function IconView(props: IconViewProps) {
  const { size = "md", Icon, fill = "" } = props;
  return <Icon className={`[&>svg]:${iconConfig[size]} [&>svg]:${fill}`} />;
}
