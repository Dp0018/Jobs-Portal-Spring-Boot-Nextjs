import Cookies from 'js-cookie';

export const setItem = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    Cookies.set(key, JSON.stringify(value), { path: '/' });
  }
};

export const getItem = (key: string) => {
  if (typeof window !== "undefined") {
    const item = Cookies.get(key);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  }
  return null;
};

export const removeItem = (key: string) => {
  if (typeof window !== "undefined") {
    Cookies.remove(key, { path: '/' });
  }
};
