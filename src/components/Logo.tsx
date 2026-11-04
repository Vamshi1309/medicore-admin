import { Image, ImageProps } from 'expo-image';

// If your file has a different name, change only this line
const logo = require('../../assets/logo.png');

interface Props {
  width?: number;
  height?: number;
  style?: ImageProps['style'];
}

export default function Logo({ width = 180, height = 72, style }: Props) {
  return <Image source={logo} contentFit="contain" style={[{ width, height }, style]} />;
}