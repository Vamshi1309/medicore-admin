export const picsumUrl = (id: string, width: number, height: number) =>
    `https://picsum.photos/id/${id}/${width}/${height}`;

export const picsumSeedUrl = (seed: string, size: number) =>
  `https://picsum.photos/seed/${seed}/${size}/${size}`;