import axios from "axios";

import { getItem } from "@/modules/redux/local-storage-service";

const base_url = `${process.env.NEXT_PUBLIC_API_URL}/reviews`;

export const addReview = async (reviewerId: number, companyId: number, rating: number, comment: string, reviewerName: string) => {
  try {
    const user = getItem("user");
    const token = user?.token || null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.post(base_url, {
      reviewerId,
      companyId,
      rating,
      comment,
      reviewerName
    }, { headers });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReview = async (id: number, reviewerId: number, companyId: number, rating: number, comment: string, reviewerName: string) => {
  try {
    const user = getItem("user");
    const token = user?.token || null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.put(base_url, {
      id,
      reviewerId,
      companyId,
      rating,
      comment,
      reviewerName
    }, { headers });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReview = async (id: number) => {
  try {
    const user = getItem("user");
    const token = user?.token || null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.delete(`${base_url}/${id}`, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReviewsByCompanyId = async (companyId: number) => {
  try {
    const response = await axios.get(`${base_url}/company/${companyId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
