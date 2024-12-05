import { createApi } from "@reduxjs/toolkit/query/react";
import { supabase } from "../lib/supabaseClient";
import { supabaseBaseQuery } from "./baseQuery";
import { Database } from "../types/database.types";

export type Item = {
  id: number;
  description: string | null;
  type: string | null;
  weightInGrams: number | null;
};

export const itemMapper: (
  item: Database["public"]["Tables"]["items"]["Row"]
) => Item = (item) => ({
  id: item.id,
  type: item.type,
  description: item.description,
  weightInGrams: item.weight_in_grams,
});

export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery: supabaseBaseQuery,
  endpoints: (builder) => ({
    searchItems: builder.query({
      queryFn: async ({ searchString, excludeIds = [] }) => {
        const { data, error } = await supabase
          .from("items")
          .select()
          .not("id", "in", `(${excludeIds.join(",")})`)
          .ilike("type_description", `%${searchString}%`);

        if (error) {
          console.error(error);
          return { error };
        }

        const mappedData = data.map(itemMapper);
        return { data: mappedData };
      },
    }),
    createItem: builder.mutation({
      queryFn: async (item) => {
        const { data, error } = await supabase
          .from("items")
          .insert(item)
          .select();

        if (error) {
          console.error(error);
          return { error };
        }

        const mappedData = data.map(itemMapper);
        return { data: mappedData };
      },
    }),
  }),
});

export const { useCreateItemMutation, useLazySearchItemsQuery } = itemsApi;
