"use client";

import { Text, Box } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { urlNasaSearch } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";
import { ResultDisplay } from "./ResultDisplay";

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
    return (
      <Text>Error: {error instanceof Error || "Something went wrong"}</Text>
    );
  }

  return (
    <Box marginTop="s" paddingTop="s">
      {data.collection.items.map((item, index) => (
        <ResultDisplay key={index} item={item} index={index} />
      ))}
    </Box>
  );
}
