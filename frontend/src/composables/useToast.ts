import { ref } from "vue";

type ToastType = "success" | "error";

const visible = ref(false);
const message = ref("");
const type = ref<ToastType>("success");
let timer: number | null = null;

export function showToast(nextMessage: string, nextType: ToastType = "success", duration = 2200) {
  message.value = nextMessage;
  type.value = nextType;
  visible.value = true;

  if (timer) {
    window.clearTimeout(timer);
  }

  timer = window.setTimeout(() => {
    visible.value = false;
    timer = null;
  }, duration);
}

export function hideToast() {
  visible.value = false;
  if (timer) {
    window.clearTimeout(timer);
    timer = null;
  }
}

export function useToast() {
  return { visible, message, type, showToast, hideToast };
}
