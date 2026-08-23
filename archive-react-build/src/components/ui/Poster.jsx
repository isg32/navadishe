export default function Poster({
  name,
  alt,
  className = '',
  sizes = '(min-width: 1024px) 640px, 100vw',
  priority = false,
  rounded = true,
  widths = [1600, 800],
  width,
  height,
}) {
  const [large, small] = widths;
  return (
    <img
      src={`/images/${name}-${large}.webp`}
      srcSet={`/images/${name}-${small}.webp ${small}w, /images/${name}-${large}.webp ${large}w`}
      sizes={sizes}
      alt={alt}
      width={width ?? large}
      height={height ?? Math.round(large * (9 / 16))}
      loading={priority ? 'eager' : 'lazy'}
      // lowercase: React 18 doesn't recognize the camelCase DOM property yet
      fetchpriority={priority ? 'high' : 'auto'}
      className={`w-full object-cover ${rounded ? 'rounded-lg' : ''} ${className}`}
    />
  );
}
