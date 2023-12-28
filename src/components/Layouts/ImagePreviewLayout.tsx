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
    height = 100,
    width = 100,
    ...rest
  } = props;
  return (
    <div className={`${wrapperClassName}`}>
      <Image
        className={`${className} h-[100px] w-[100px] object-cover`}
        src={src || "/no-image.png"}
        height={height}
        loading="lazy"
        alt={alt}
        width={width}
        {...rest}
      />
    </div>
  );
}
