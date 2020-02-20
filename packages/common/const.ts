export type rawCurrentlyPlayingObject = {
  timestamp: number;
  is_playing: boolean;
  item: Track;
};

type Track = {
  album: Album;
  artists: Artist[];
  external_urls: { [s: string]: string };
  href: string;
  id: string;
  name: string;
  popularity: number;
  previer_url: string;
  uri: string;
};

type Album = {
  images: AlbumImage[];
};

type AlbumImage = {
  url: string;
};

type Artist = {
  name: string;
};
