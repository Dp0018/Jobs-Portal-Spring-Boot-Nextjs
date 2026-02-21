import { toast } from "sonner";

export const successNotification = (title: string, message: string) => {
  toast.success(title, {
    description: message,
  });
};

export const errorNotification = (title: string, message: string) => {
  toast.error(title, {
    description: message,
  });
};
