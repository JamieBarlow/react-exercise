"use client";

import { Text, Box } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { urlNasaSearch } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";

export function List({ values }: { values: NasaSearchParams }) {
  const urlNasaSearchUrl = values ? urlNasaSearch(values) : "";

  console.log(urlNasaSearchUrl);

  const { data, isLoading, isError, error } = useQuery<NasaResponse>(
    ["nasaSearch", values],
    () => fetch(urlNasaSearchUrl).then((res) => res.json()),
    { enabled: !!urlNasaSearchUrl.length }
  );
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (isError) {
    return <Text>Error: {error?.message || "Something went wrong"}</Text>;
  }

  return (
    <Box marginTop="s" paddingTop="s">
      {data.collection.items.map((item) =>
        item.data.map((dataItem) => (
          <Box key={dataItem.nasa_id} marginBottom="m">
            <Text>{dataItem.center}</Text>
            <Text>{dataItem.title}</Text>
            <Text>{dataItem.location}</Text>
            <Text>{dataItem.nasa_id}</Text>
            <Text>{dataItem.description}</Text>
            <Text>{dataItem.date_created}</Text>
          </Box>
        ))
      )}
    </Box>
  );
}
