import { Box, Text, Heading } from "@cruk/cruk-react-components";
import { ItemsType } from "../types";
import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export function ResultDisplay({
  item,
  index,
  media,
  mediaType,
}: {
  item: ItemsType;
  index: number;
  media: string;
  mediaType: "audio" | "video" | "image";
}) {
  const backgroundColors = ["primary", "secondary", "tertiary"];

  function alternateBgColor(colors: string[]) {
    return colors[index % backgroundColors.length];
  }

  function renderMedia(mediaType: string, media: string, title: string) {
    if (!media) {
      return <Text>Loading media...</Text>;
    }
    switch (mediaType) {
      case "image":
        return <img src={media} alt={title} aria-label={title} />;
      case "video":
        return (
          <video controls width="100%" aria-label={`Video: ${title}`}>
            <source src={media} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "audio":
        return (
          <audio controls>
            <source src={media} aria-label={`Audio: ${title}`} />
            Your browser does not support the audio element.
          </audio>
        );
      default:
        return <Text>Unsupported media type</Text>;
    }
  }

  function createReadableDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <>
      {item.data.map((dataItem) => {
        const backgroundColor = alternateBgColor(backgroundColors);
        const readableDate = createReadableDate(dataItem.date_created);

        return (
          <Box key={index} marginBottom="m" backgroundColor={backgroundColor}>
            <Heading textColor="textOnPrimary">{dataItem.title}</Heading>
            <FlexContainer>
              <Heading h3 textColor="textOnPrimary" marginTop="none">
                {`Centre: ${dataItem.center}`}
              </Heading>
              <Heading h3 textColor="textOnPrimary" marginTop="none">
                {dataItem.location}
              </Heading>
            </FlexContainer>
            <Heading
              h4
              textColor="textOnPrimary"
              marginTop="none"
            >{`NASA ID: ${dataItem.nasa_id}`}</Heading>
            {mediaType === "audio" ? null : (
              <Text textColor="textOnPrimary">{dataItem.description}</Text>
            )}
            {renderMedia(mediaType, media, dataItem.title)}
            <Text textColor="textOnPrimary">{`Date created: ${readableDate}`}</Text>
          </Box>
        );
      })}
    </>
  );
}
