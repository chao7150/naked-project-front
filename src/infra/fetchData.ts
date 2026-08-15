import { API_ENDPOINT, API_HOST } from "./consts";

export async function fetchByDate<T>(date: Date): Promise<T> {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const url = new URL(
    `${API_ENDPOINT}?start=${encodeURIComponent(
      new Date(year, month, day, 0, 0, 0, 0).toISOString(),
    )}&end=${encodeURIComponent(
      new Date(year, month, day, 23, 59, 59, 999).toISOString(),
    )}`,
    API_HOST,
  );
  const response = await fetch(url.href);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchTodayAndYesterday<T>(date: Date): Promise<T[]> {
  const yesterdayPromise = fetchByDate<T>(
    new Date(date.valueOf() - 1000 * 60 * 60 * 24),
  );
  const todayPromise = fetchByDate<T>(date);
  return Promise.all([yesterdayPromise, todayPromise]);
}
