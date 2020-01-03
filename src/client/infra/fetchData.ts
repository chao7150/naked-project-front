import * as moment from "moment-timezone";
import axios, { AxiosResponse } from "axios";
import { API_ENDPOINT, API_HOST } from "./consts";

export async function fetchByDate<T>(
  date: moment.Moment,
): Promise<AxiosResponse<T>> {
  // TODO: パスの作り方を考える
  const url = new URL(`${API_ENDPOINT}/${date.format("YYYY/MM/DD")}`, API_HOST);
  return axios.get<T>(url.href);
}

export async function fetchTodayAndYesterday<T>(
  date: moment.Moment,
): Promise<AxiosResponse<T>[]> {
  const yesterdayPromise = fetchByDate<T>(date.clone().subtract(1, "days"));
  const todayPromise = fetchByDate<T>(date);
  return Promise.all([yesterdayPromise, todayPromise]);
}
