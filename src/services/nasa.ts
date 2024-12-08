import { NasaSearchParams } from "../types";

export const NASA_API_URL = "https://images-api.nasa.gov/search";

export const urlNasaSearch = ({
  keywords,
  mediaType,
  yearStart,
  page = 1,
  page_size = 10,
}: NasaSearchParams): string => {
  const paramsObjectWithSnakeCaseKeys = {
    keywords,
    media_type: mediaType,
    ...(!!yearStart &&
      !Number.isNaN(yearStart) && { year_start: `${yearStart}` }),
    page: `${page}`,
    page_size: `${page_size}`,
  };
  const paramsString = new URLSearchParams(
    paramsObjectWithSnakeCaseKeys
  ).toString();
  return `${NASA_API_URL}?${paramsString}`;
};

export const NASA_API_MEDIA_URL = "https://images-api.nasa.gov/asset";

export const nasaMediaSearch = (nasa_id: string): string => {
  const paramsString = `${NASA_API_MEDIA_URL}/${nasa_id}`;
  return paramsString;
};
