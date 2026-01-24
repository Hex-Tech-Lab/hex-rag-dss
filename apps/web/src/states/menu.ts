import { useMemo } from 'react';

// @third-party
import useSWR, { mutate } from 'swr';

/***************************  MENU STATE - TYPES  ***************************/

export interface MenuMaster {
  openedItem: string;
  isDashboardDrawerOpened: boolean;
}

const initialState: MenuMaster = {
  openedItem: '',
  isDashboardDrawerOpened: false
};

export const endpoints = {
  key: 'api/menu',
  master: 'master'
};

/***************************  MENU STATE - HOOKS  ***************************/

export function useGetMenuMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.master, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data || initialState,
      menuMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

/***************************  MENU STATE - HANDLERS  ***************************/

export function handlerDrawerOpen(isDashboardDrawerOpened: boolean) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster: MenuMaster = initialState) => {
      return { ...currentMenuMaster, isDashboardDrawerOpened };
    },
    false
  );
}

export function handlerActiveItem(openedItem: string) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster: MenuMaster = initialState) => {
      return { ...currentMenuMaster, openedItem };
    },
    false
  );
}
