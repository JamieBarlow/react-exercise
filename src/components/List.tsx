"use client";

import { Text } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { urlNasaSearch } from "../services/nasa";
import { useQuery } from "@tanstack/react-query";

export function List() {
  const values: NasaSearchParams = {
    keywords: "moon",
    mediaType: "audio",
    yearStart: 2000,
  };

  const urlNasaSearchUrl = values
    ? urlNasaSearch(values as NasaSearchParams)
    : "";

  console.log(urlNasaSearchUrl);

  const { data } = useQuery<NasaResponse>(
    ["nasaSearch", values],
    () => fetch(urlNasaSearchUrl).then((res) => res.json()),
    { enabled: !!urlNasaSearchUrl.length }
  );

  // TODO somehow render results
  return <>{!!data && <Text>{JSON.stringify(data)}</Text>}</>;
}
