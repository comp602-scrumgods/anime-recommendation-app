import { useState } from "react";
import axios from "axios";

interface FetchAnimeParams {
  search?: string;
  year?: number;
  genre?: string;
  sort?: string[];
  id?: number;
  includeRecommendations?: boolean;
}

const useAniListApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimeByQuery = async (params: FetchAnimeParams) => {
    setLoading(true);
    setError(null);

    const query = `
      query ($sort: [MediaSort], $perPage: Int, $id: Int, $search: String, $year: FuzzyDateInt, $genre: String) {
        Page(page: 1, perPage: $perPage) {
          media(id: $id, search: $search, type: ANIME, startDate_greater: $year, genre: $genre, sort: $sort) {
            id
            title { romaji english native }  ### ✅ FULL FIX HERE
            coverImage { extraLarge medium large }
            popularity
            trending
            startDate { year }
            genres
            averageScore
            episodes
            description
            ${
              params.includeRecommendations
                ? `
              recommendations(perPage: 2) {
                nodes {
                  mediaRecommendation {
                    id
                    title { romaji english native }
                    coverImage { extraLarge }
                  }
                }
              }
            `
                : ""
            }
          }
        }
      }
    `;

    try {
      const variables: any = {
        perPage: params.id ? 1 : 10,
      };
      if (params.search) variables.search = params.search;
      if (params.year) {
        if (params.year < 1900 || params.year > 2100) {
          throw new Error("Year must be between 1900 and 2100.");
        }
        variables.year = params.year * 10000;
      }
      if (params.genre) {
        variables.genre =
          params.genre.charAt(0).toUpperCase() +
          params.genre.slice(1).toLowerCase();
      }
      if (params.sort) {
        const validSorts = [
          "ID",
          "ID_DESC",
          "TITLE_ROMAJI",
          "TITLE_ROMAJI_DESC",
          "TITLE_ENGLISH",
          "TITLE_ENGLISH_DESC",
          "TITLE_NATIVE",
          "TITLE_NATIVE_DESC",
          "TYPE",
          "TYPE_DESC",
          "FORMAT",
          "FORMAT_DESC",
          "EPISODES",
          "EPISODES_DESC",
          "DURATION",
          "DURATION_DESC",
          "STATUS",
          "STATUS_DESC",
          "START_DATE",
          "START_DATE_DESC",
          "END_DATE",
          "END_DATE_DESC",
          "SCORE",
          "SCORE_DESC",
          "POPULARITY",
          "POPULARITY_DESC",
          "TRENDING",
          "TRENDING_DESC",
          "FAVOURITES",
          "FAVOURITES_DESC",
        ];
        if (!params.sort.every((sort) => validSorts.includes(sort))) {
          throw new Error(
            `Invalid sort value. Must be one of: ${validSorts.join(", ")}`,
          );
        }
        variables.sort = params.sort;
      }
      if (params.id) variables.id = params.id;

      const response = await axios.post("https://graphql.anilist.co", {
        query,
        variables,
      });

      const data = response.data.data.Page.media;
      if (!data || data.length === 0) {
        setError("No anime found for the given parameters.");
      }
      setLoading(false);
      return data;
    } catch (err: any) {
      console.error("AniList API error:", err.message);
      setError(`Failed to fetch anime data: ${err.message}`);
      setLoading(false);
      return [];
    }
  };

  const fetchAnimeById = async (id: number, includeRecommendations = false) => {
    if (!id || id <= 0) {
      setError("Invalid anime ID provided.");
      return null;
    }
    const data = await fetchAnimeByQuery({ id, includeRecommendations });
    return data[0] || null;
  };

  return { fetchAnimeByQuery, fetchAnimeById, loading, error };
};

export default useAniListApi;
