import { get, put, post, del, getPage } from "../api/ApiManager";
import {
  fetchCategories,
  fetchAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../api/CategoryServices";
import { CATEGORIES_API_URL } from "../constants/apiConstants";

jest.mock("../api/ApiManager");

describe("CategoryService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchCategories", () => {
    it("should call getPage with correct arguments", async () => {
      const mockResponse = { data: [], totalPages: 1 };
      getPage.mockResolvedValue(mockResponse);

      const page = 1;
      const pageSize = 10;
      const search = "test";

      const result = await fetchCategories(page, pageSize, search);

      expect(getPage).toHaveBeenCalledWith(CATEGORIES_API_URL, page, pageSize, search);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchAllCategories", () => {
    it("should call get with correct URL", async () => {
      const mockResponse = [{ id: 1, name: "Category 1" }];
      get.mockResolvedValue(mockResponse);

      const result = await fetchAllCategories();

      expect(get).toHaveBeenCalledWith(CATEGORIES_API_URL);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("addCategory", () => {
    it("should call post with correct URL and categoryData", async () => {
      const categoryData = { name: "New Category" };
      const mockResponse = { id: 1, ...categoryData };
      post.mockResolvedValue(mockResponse);

      const result = await addCategory(categoryData);

      expect(post).toHaveBeenCalledWith(CATEGORIES_API_URL, categoryData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateCategory", () => {
    it("should call put with correct URL, id, and categoryData", async () => {
      const id = 1;
      const categoryData = { name: "Updated Category" };
      const mockResponse = { id, ...categoryData };
      put.mockResolvedValue(mockResponse);

      const result = await updateCategory(id, categoryData);

      expect(put).toHaveBeenCalledWith(CATEGORIES_API_URL, id, categoryData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteCategory", () => {
    it("should call del with correct URL and id", async () => {
      const id = 1;
      const mockResponse = { success: true };
      del.mockResolvedValue(mockResponse);

      const result = await deleteCategory(id);

      expect(del).toHaveBeenCalledWith(CATEGORIES_API_URL, id);
      expect(result).toEqual(mockResponse);
    });
  });
});
