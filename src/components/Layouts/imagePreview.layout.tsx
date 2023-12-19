import Image, { ImageProps } from "next/image";

interface ImagePreviewLayoutProps extends ImageProps {
  src: string;
  name?: string;
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
        loading="lazy"
        alt={alt}
        width={100}
        {...rest}
      />
    </div>
  );
}
