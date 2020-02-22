import React from "react";
import { Music } from "../../../domain/Music";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 5fr 8fr;
  grid-template-rows: 2fr 1fr 1fr 2fr;
`;

const Thumbnail = styled.img`
  grid-column: 1;
  grid-row: 1 / 5;
  max-width: 100%;
  height: auto;
`;

const Grid = styled.div`
  display: flex;
  align-items: center;
`;

const TitleGrid = styled(Grid)`
  grid-column: 2;
  grid-row: 2;
`;

const Title = styled.a`
  font-size: 2rem;
  padding: 0 0 0 1rem;
`;

const ArtistsGrid = styled(Grid)`
  grid-column: 2;
  grid-row: 3;
`;

const Artists = styled.span`
  font-size: 1.5rem;
  padding: 0 0 0 3rem;
`;

export const MusicComponent: React.FC<Music> = ({
  imageUrl,
  spotifyUrl,
  name,
  artists,
}) => {
  const artistsString = artists ? artists.join(" / ") : "";
  return (
    <Wrapper>
      <Thumbnail src={imageUrl} alt="" />
      <TitleGrid>
        <Title href={spotifyUrl}>{name}</Title>
      </TitleGrid>
      <ArtistsGrid>
        <Artists>{artistsString}</Artists>
      </ArtistsGrid>
    </Wrapper>
  );
};
