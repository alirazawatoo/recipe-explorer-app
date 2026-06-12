import React from 'react';

const PLACEHOLDER = '/recipe-placeholder.svg';

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError'>;

/** An <img> that swaps to the bundled placeholder once if the recipe photo fails to load. */
export function RecipeImage({ src, ...rest }: Props) {
  return (
    <img
      {...rest}
      src={src || PLACEHOLDER}
      onError={(event) => {
        if (!event.currentTarget.src.endsWith(PLACEHOLDER)) event.currentTarget.src = PLACEHOLDER;
      }}
    />
  );
}
