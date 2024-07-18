import createApi from "../utils/axios";
import { METHODS } from "../enums/axios.enums";
import { Category } from "src/types/interfaces/category.interface";

const categoryApi = createApi("/category");

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await categoryApi({
    method: METHODS.GET,
    params: { pagination: false },
  });

  // TODO: add pagination
  return data?.docs ?? [];
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const { data } = await categoryApi({
    url: `/${id}`,
    method: METHODS.GET,
  });

  return data;
};
