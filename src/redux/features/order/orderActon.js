import { setLoading, setOrderList, setError } from "./orderSlice";
import { getOrderApi, orderCancelApi } from "./orderApi"
import { toast } from "sonner";

let fetchOrderPromises = {};

export const getOrder =({ page = 1, limit = 10, refresh = false } = {}) =>
  async (dispatch, getState) => {
    const { orderLists, loading } = getState().order;

    const promiseKey = `${page}-${limit}`;

    if (fetchOrderPromises[promiseKey] && !refresh) {
      return fetchOrderPromises[promiseKey];
    }

    if (
      !refresh &&
      !loading &&
      orderLists?.page === page &&
      Array.isArray(orderLists?.orders)
    ) {
      return orderLists;
    }

    fetchOrderPromises[promiseKey] = (async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const response = await getOrderApi({
          page,
          limit,
        });

        const data = response?.data;

        dispatch(setOrderList(data));

        return data;
      } catch (err) {
        dispatch(
          setError(err?.message || "Failed to fetch orders")
        );

        throw err;
      } finally {
        dispatch(setLoading(false));
        delete fetchOrderPromises[promiseKey];
      }
    })();

    return fetchOrderPromises[promiseKey];
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