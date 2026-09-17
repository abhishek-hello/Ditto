/**
 * Static asset imports (`import logo from '../../assets/brand/logo-inline.png'`).
 * Metro resolves the @2x / @3x variants; TypeScript only needs the shape.
 */
declare module '*.png' {
  import type { ImageSourcePropType } from 'react-native';

  const source: ImageSourcePropType;
  export default source;
}

/** Font files handed to `useFonts`. Metro returns a module id or a URI. */
declare module '*.otf' {
  const source: number | string;
  export default source;
}
