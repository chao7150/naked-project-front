import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { GraphContainer } from "../organisms/GraphContainer";
import { WeatherData } from "../../domain/WeatherData";
import { Header } from "../organisms/Header";
import * as moment from "moment-timezone";
import { fetchTodayAndYesterday } from "../../infra/fetchData";

export const App: React.FunctionComponent = () => {
  const [data, setData] = useState<WeatherData[]>([]);
  useEffect(() => {
    const fetch = async (): Promise<void> => {
      const [yesterdayResult, todayResult] = (
        await fetchTodayAndYesterday<{ data: WeatherData[] }>(
          moment().tz("Asia/Tokyo"),
        )
      ).map(raw => raw.data.data);
      setData([...yesterdayResult, ...todayResult].slice(-12 * 24));
    };
    fetch();
    setInterval(fetch, 10 * 1000);
  }, []);

  const standardPressure = 1013;
  const pressureList = data.map(({ pressure }) => pressure);
  const minPressure = Math.min(standardPressure, ...pressureList);
  const maxPressure = Math.max(standardPressure, ...pressureList);

  return (
    <>
      <Header />
      <GraphContainer
        title="気温"
        data={data}
        dataKey={"temperature"}
        domain={[0, 40]}
        referenceProps={{ y: 17, label: "↓違法", stroke: "red" }}
      />
      <GraphContainer
        title="湿度"
        data={data}
        dataKey={"humidity"}
        domain={[0, 70]}
        referenceProps={{ y: 40, label: "↓違法", stroke: "red" }}
      />
      <GraphContainer
        title="気圧"
        data={data}
        dataKey={"pressure"}
        domain={[minPressure, maxPressure]}
        referenceProps={{ y: standardPressure, label: "標準気圧" }}
      />
    </>
  );
};
