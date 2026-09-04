import {
  setLoading,
  setAddress,
  setError,
} from "./addressSlice";

import {
  addressApi,
  getAddressApi,
  updateAddressApi,
  deleteAddressApi,
} from "./addressApi";
import { toast } from "sonner";

let fetchAddressPromise = null;

export const getAddress = (refresh = false) => async (dispatch, getState) => {
  const { addressData, loading } = getState().address;

  if (!refresh && loading) {
    return addressData;
  }

  if (!refresh && addressData) {
    return addressData;
  }

  if (fetchAddressPromise) {
    return fetchAddressPromise;
  }

  fetchAddressPromise = (async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await getAddressApi();

      dispatch(setAddress(response.data));

      return response.data;
    } catch (err) {
      dispatch(
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch addresses"
        )
      );

      throw err;
    } finally {
      dispatch(setLoading(false));
      fetchAddressPromise = null;
    }
  })();

  return fetchAddressPromise;
};

export const createAddress =(address) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await addressApi(address);

      dispatch(getAddress(true));
      toast.success("Address Add Successfully")

      return response.data;
    } catch (err) {
      dispatch(
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to create address"
        )
      );
       toast.error("Failed To Address")

      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateAddress =(id, address) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await updateAddressApi(
        id,
        address
      );

      dispatch(getAddress(true));
      toast.success("Address Update Successfully");

      return response.data;
    } catch (err) {
      dispatch(
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to update address"
        )
      );

      toast.error("Failed To Update Address");

      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteAddress =(id) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await deleteAddressApi(id);

      dispatch(getAddress(true));
      toast.success("Address Delete Successfully");

      return response.data;
    } catch (err) {
      dispatch(
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to delete address"
        )
      );
      toast.error("Failed To Delete Address");

      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };