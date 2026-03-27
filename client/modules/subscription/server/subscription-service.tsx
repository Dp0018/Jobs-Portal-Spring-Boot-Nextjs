import axios from "axios";
import { getItem } from "@/modules/redux/local-storage-service";

const base_url = `${process.env.NEXT_PUBLIC_API_URL}/subscriptions`;

export const createCheckoutSession = async (priceId: string, successUrl: string, cancelUrl: string) => {
  try {
    const user = getItem("user");
    const token = user?.token || null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.post(`${base_url}/checkout`, {
      priceId,
      successUrl,
      cancelUrl,
    }, { headers });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
