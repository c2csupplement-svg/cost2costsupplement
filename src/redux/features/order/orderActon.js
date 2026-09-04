import { setLoading, setOrderList, setError } from "./orderSlice";
import { getOrderApi, orderCancelApi } from "./orderApi"
import { toast } from "sonner";

let fetchOrdePromise = null;

export const getOrder = (refresh = false) => async (dispatch, getState) => {

    const { orderLists, loading } = getState().order;

    if (!refresh && loading) {
        return orderLists;
    }

    if (!refresh && orderLists) {
        return orderLists;
    }

    if (fetchOrdePromise) {
        return fetchOrdePromise;
    }

    fetchOrdePromise = (async () => {
        try {
            dispatch(setLoading(true));

            const response = await getOrderApi();

            dispatch(setOrderList(response.data));

            return response.data;
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
            fetchOrdePromise = null;
        }
    })();

    return fetchOrdePromise;
};

export const orderCancel = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));

        const response = await orderCancelApi(id);

        if (response?.data?.success) {
            await dispatch(getOrder(true));
        } else {
            toast.error(response?.data?.message || "Failed to cancel order");
        }
    } catch (err) {
        dispatch(setError(err.message));
    } finally {
        dispatch(setLoading(false));
    }
};