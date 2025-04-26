import { toast } from "sonner";

type Props = {
    messages: {
        loading: string,
        success: string,
        error: string
    }
}

export async function withToast<T>(promise: Promise<T>, messages: Props["messages"]): Promise<T> {
    const toastId = toast.loading(messages.loading);
    try {
        const result = await promise;
        toast.success(messages.success, { id: toastId });
        return result;
    } catch (err) {
        console.error(err);
        toast.error(messages.error, { id: toastId });
        throw err;
    }
}
