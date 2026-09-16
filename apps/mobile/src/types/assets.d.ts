/**
 * Static image imports (`import logo from '../../assets/brand/logo-dark.png'`).
 * Metro resolves the @2x / @3x variants; TypeScript only needs the shape.
 */
declare module '*.png' {
  import type { ImageSourcePropType } from 'react-native';

  const source: ImageSourcePropType;
  export default source;
}
