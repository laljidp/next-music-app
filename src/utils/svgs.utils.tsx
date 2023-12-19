export const googleIcon = (
  <svg
    className="h-5 w-5 text-white mr-2 fill-white"
    viewBox="0 0 448 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M448 256c0 143.4-118.6 222.3-225 222.3c-132.3 0-222.1-106.2-222.1-222.4c0-124.4 100.9-223.9 223.1-223.9c84.84 0 167.8 55.28 167.8 88.2c0 18.28-14.95 32-32 32c-31.04 0-46.79-56.16-135.8-56.16c-87.66 0-159.1 70.66-159.1 159.8c0 34.81 27.19 158.8 159.1 158.8c79.45 0 144.6-55.1 158.1-126.7h-134.1c-17.67 0-32-14.33-32-32s14.33-31.1 32-31.1H416C433.7 224 448 238.3 448 256z" />
  </svg>
);

export const pageLoaderSvg = (
  <svg
    className="animate-pulse fill-violet-400"
    width="80"
    height="80"
    viewBox="0 0 135 140"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="10" width="15" height="120" rx="6">
      <animate
        attributeName="height"
        begin="0.5s"
        dur="1s"
        values="120;110;100;90;80;70;60;50;40;140;120"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y"
        begin="0.5s"
        dur="1s"
        values="10;15;20;25;30;35;40;45;50;0;10"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </rect>
    <rect x="30" y="10" width="15" height="120" rx="6">
      <animate
        attributeName="height"
        begin="0.25s"
        dur="1s"
        values="120;110;100;90;80;70;60;50;40;140;120"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y"
        begin="0.25s"
        dur="1s"
        values="10;15;20;25;30;35;40;45;50;0;10"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </rect>
    <rect x="60" width="15" height="140" rx="6">
      <animate
        attributeName="height"
        begin="0s"
        dur="1s"
        values="120;110;100;90;80;70;60;50;40;140;120"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y"
        begin="0s"
        dur="1s"
        values="10;15;20;25;30;35;40;45;50;0;10"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </rect>
    <rect x="90" y="10" width="15" height="120" rx="6">
      <animate
        attributeName="height"
        begin="0.25s"
        dur="1s"
        values="120;110;100;90;80;70;60;50;40;140;120"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y"
        begin="0.25s"
        dur="1s"
        values="10;15;20;25;30;35;40;45;50;0;10"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </rect>
    <rect x="120" y="10" width="15" height="120" rx="6">
      <animate
        attributeName="height"
        begin="0.5s"
        dur="1s"
        values="120;110;100;90;80;70;60;50;40;140;120"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="y"
        begin="0.5s"
        dur="1s"
        values="10;15;20;25;30;35;40;45;50;0;10"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
);

export const SvgIcon = ({
  Icon,
  height = 15,
  width = 15,
}: {
  Icon: any;
  height: number;
  width: number;
}) => {
  return (
    <i
      className={`[&>svg]:fill-violet-500 [&>svg]:h-[${height}px] [&>svg]:w-[${width}px]`}
    >
      {<Icon />}
    </i>
  );
};
