import type { CSSProperties } from 'react';

// Original user-provided PNGs. Crops hide only the baked-in captions/background;
// welcome uses the full image so the antenna, hands and body stay visible.
const images = {
  idle: ['button-idle.png', 67, 71, 0, 0, 67, 67],
  hover: ['button-hover.png', 124, 145, 20, 22, 74, 74],
  unread: ['button-unread.png', 117, 145, 14, 19, 78, 78],
  hello: ['hello.png', 169, 145, 0, 0, 169, 120],
  help: ['happy-to-help.png', 135, 145, 0, 0, 135, 120],
  ask: ['ask.png', 148, 145, 0, 0, 148, 120],
  great: ['great.png', 139, 145, 0, 0, 139, 120],
  searching: ['searching.png', 199, 145, 0, 0, 199, 120],
  welcome: ['welcome.png', 1536, 1024, 0, 0, 1536, 1024],
} as const;
export type LinPose = keyof typeof images;
export function LinArt({ pose, className = '' }: { pose: LinPose; className?: string }) {
  const [file, width, height, x, y, cropWidth, cropHeight] = images[pose];
  const style: CSSProperties = { aspectRatio: `${cropWidth} / ${cropHeight}` };
  const imageStyle: CSSProperties = { width: `${width / cropWidth * 100}%`, transform: `translate(${-x / width * 100}%, ${-y / height * 100}%)` };
  return <span className={`lin-art ${className}`} style={style} data-pose={pose} aria-hidden="true"><img src={`${import.meta.env.BASE_URL}assets/lin/${file}`} width={width} height={height} alt="" draggable={false} style={imageStyle} decoding="async" /></span>;
}
