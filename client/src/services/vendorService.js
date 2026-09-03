import api from "./api";

export const getVendors = async (params = {}) => {
  const response = await api.get("/vendors", { params });
  return response.data;
};

export const getVendorById = async (id) => {
  const response = await api.get(`/vendors/${id}`);
  return response.data;
};