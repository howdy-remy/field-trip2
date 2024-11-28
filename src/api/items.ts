import { createApi } from "@reduxjs/toolkit/query/react";
import { supabase } from "../lib/supabaseClient";
import { supabaseBaseQuery } from "./baseQuery";

export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery: supabaseBaseQuery,
  endpoints: (builder) => ({
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
        return { data };
      },
    }),
  }),
});

export const { useCreateItemMutation } = itemsApi;
