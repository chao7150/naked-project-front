import axios, { AxiosResponse } from "axios";
import { API_ENDPOINT, API_HOST } from "./consts";

export async function fetchByDate<T>(date: Date): Promise<AxiosResponse<T>> {
  // TODO: パスの作り方を考える
  const url = new URL(
    `${API_ENDPOINT}?start=${encodeURIComponent(
      new Date(date.setHours(0, 0, 0, 0)).toISOString(),
    )}&end=${encodeURIComponent(
      new Date(date.setHours(23, 59, 59, 999)).toISOString(),
    )}`,
    API_HOST,
  );
  return axios.get<T>(url.href);
}

export async function fetchTodayAndYesterday<T>(
  date: Date,
): Promise<AxiosResponse<T>[]> {
  const yesterdayPromise = fetchByDate<T>(
    new Date(date.valueOf() - 1000 * 60 * 60 * 24),
  );
  const todayPromise = fetchByDate<T>(date);
  return Promise.all([yesterdayPromise, todayPromise]);
}
