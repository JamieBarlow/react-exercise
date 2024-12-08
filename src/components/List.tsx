"use client";

import { Text, Box } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { nasaMediaSearch, urlNasaSearch } from "../services/nasa";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ResultDisplay } from "./ResultDisplay";
import { useEffect, useState } from "react";

export function List({ values }: { values: NasaSearchParams }) {
  const urlNasaSearchUrl = values ? urlNasaSearch(values) : "";

  const [nasaIds, setNasaIds] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useQuery<NasaResponse>(
    ["nasaSearch", values],
    () => fetch(urlNasaSearchUrl).then((res) => res.json()),
    { enabled: !!urlNasaSearchUrl.length }
  );

  console.log("API RESPONSE:");
  console.log(data);

  useEffect(() => {
    if (data) {
      const newIds = data.collection.items.flatMap((item) =>
        item.data.map((dataItem) => dataItem.nasa_id)
      );
      setNasaIds((prevIds) => [...prevIds, ...newIds]);
    }
  }, [data]);

  const mediaQueries = useQueries({
    queries: nasaIds.map((id) => ({
      queryKey: ["mediaItem", id],
      queryFn: () => fetch(`${nasaMediaSearch(id)}`).then((res) => res.json()),
    })),
  });

  const mediaUrls = mediaQueries.map((item, index) => {
    if (item.data && item.data.collection) {
      return item.data.collection.items[0].href;
    } else {
      console.log(`Invalid structure for item ${index}, skipping...`);
    }
  });

  console.log("MEDIA QUERIES:", mediaUrls);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (isError) {
    return (
      <Text>
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </Text>
    );
  }

  return (
    <Box marginTop="s" paddingTop="s">
      {data.collection.items.map((item, index) => (
        <ResultDisplay
          key={index}
          item={item}
          index={index}
          media={mediaUrls[index]}
          mediaType={values.mediaType}
        />
      ))}
    </Box>
  );
}
