"use client";

import { Text, Box, Pagination, ErrorText } from "@cruk/cruk-react-components";
import { NasaResponse, NasaSearchParams } from "../types";
import { nasaMediaSearch, urlNasaSearch } from "../services/nasa";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ResultDisplay } from "./ResultDisplay";
import { useEffect, useState } from "react";

export function List({ values }: { values: NasaSearchParams }) {
  const [nasaIds, setNasaIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const urlNasaSearchUrl = urlNasaSearch({ ...values, page: currentPage });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { data, isLoading, isError, error } = useQuery<NasaResponse>(
    ["nasaSearch", values, currentPage],
    () => fetch(urlNasaSearchUrl).then((res) => res.json()),
    { enabled: !!urlNasaSearchUrl.length }
  );

  useEffect(() => {
    if (data) {
      const newIds = data.collection.items.flatMap((item) =>
        item.data.map((dataItem) => dataItem.nasa_id)
      );
      setNasaIds(newIds);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [values]);

  const mediaQueries = useQueries({
    queries: nasaIds.map((id) => ({
      queryKey: ["mediaItem", id],
      queryFn: () => fetch(`${nasaMediaSearch(id)}`).then((res) => res.json()),
      enabled: !!(nasaIds.length > 0),
    })),
  });

  const mediaUrls = mediaQueries.map((item, index) => {
    if (item.isError) {
      process.env.NODE_ENV === "development" &&
        console.log(`Error fetching media item for ID ${nasaIds[index]}`);
    }
    if (item.data && item.data.collection) {
      return item.data.collection.items[0].href;
    } else {
      process.env.NODE_ENV === "development" &&
        console.log(`Invalid structure for item ${index}, skipping...`);
    }
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    let errorMessage =
      process.env.NODE_ENV === "development"
        ? JSON.stringify(error)
        : "Something went wrong.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return <ErrorText>Error: {errorMessage}</ErrorText>;
  }

  if (mediaQueries.every((query) => query.isError)) {
    return (
      <ErrorText>Error loading media items. Please try again later.</ErrorText>
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
      <Pagination
        current={currentPage}
        perPage={10}
        items={100}
        pagerCallback={handlePageChange}
      />
    </Box>
  );
}
