import { Box, Text } from "@cruk/cruk-react-components";
import { ItemsType } from "../types";

export function ResultDisplay({
  item,
  index,
}: {
  item: ItemsType;
  index: number;
}) {
  const backgroundColors = ["primary", "secondary", "tertiary"];
  console.log("Index value:", index);
  return (
    <>
      {item.data.map((dataItem) => {
        const backgroundColor =
          backgroundColors[index % backgroundColors.length];

        return (
          <Box key={index} marginBottom="m" backgroundColor={backgroundColor}>
            <Text textColor="textOnPrimary">{dataItem.center}</Text>
            <Text textColor="textOnPrimary">{dataItem.title}</Text>
            <Text textColor="textOnPrimary">{dataItem.location}</Text>
            <Text textColor="textOnPrimary">{dataItem.nasa_id}</Text>
            <Text textColor="textOnPrimary">{dataItem.description}</Text>
            <Text textColor="textOnPrimary">{dataItem.date_created}</Text>
          </Box>
        );
      })}
    </>
  );
}
