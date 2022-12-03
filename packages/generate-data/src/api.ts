import axios from "axios";

interface Parameters {
  type?: string;
  startdate?: string;
  enddate?: string;
  dateregion?: "tcg_date" | "ocg_date";
}

interface Card {
  id: string;
  name: string;
  type: string;
  desc: string;
}

interface ApiResponse {
  data: Card[];
}

const BASE_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

export const sendRequest = async (params: Parameters = {}) => {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value)
  );

  try {
    const { data } = await axios.get<ApiResponse>(url.toString(), {
      headers: { Accept: "application/json", "Accept-Encoding": "identity" },
    });
    return data.data;
  } catch (error) {
    console.warn(error);
    return [];
  }
};
