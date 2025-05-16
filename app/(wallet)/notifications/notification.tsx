import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function showToast(
  message: string,
  type: "success" | "error" = "success"
) {
  toast[type](message);
}
