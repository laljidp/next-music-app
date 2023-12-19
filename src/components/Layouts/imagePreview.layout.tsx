import Image from "next/image";

interface ImagePreviewLayoutProps extends React.HTMLProps<HTMLImageElement> {
  src: string;
  name?: string;
  alt?: string;
  wrapperClassName?: string;
  className?: string;
}

export default function ImagePreviewLayout(props: ImagePreviewLayoutProps) {
  const {
    wrapperClassName = "",
    src,
    name,
    alt = "img-layout",
    className,
    height = 150,
    width = 150,
    ...rest
  } = props;
  return (
    <div className={`${wrapperClassName}`}>
      <Image
        className={`${className} h-[${height}px] w-[${width}px]`}
        src={src || "/no-profile-image.png"}
        height={100}
        alt={alt}
        width={100}
        {...rest}
      />
    </div>
  );
}
