import React, { useState, useEffect } from "react";
import { GraphContainer } from "./GraphContainer";
import { WeatherData } from "../../../domain/WeatherData";
import { fetchTodayAndYesterday } from "../../../infra/fetchData";

export const GraphList: React.FC = () => {
  const [data, setData] = useState<WeatherData[]>([]);
  useEffect(() => {
    const fetch = async (): Promise<void> => {
      const [yesterdayResult, todayResult] = (
        await fetchTodayAndYesterday<WeatherData[]>(new Date())
      ).map(raw => raw.data);
      setData([...yesterdayResult, ...todayResult].slice(-12 * 24));
    };
    fetch();
    setInterval(fetch, 5 * 60 * 1000);
  }, []);

  const standardPressure = 1013;
  const pressureList = data.map(({ pressure }) => pressure);
  const minPressure = Math.min(standardPressure, ...pressureList);
  const maxPressure = Math.max(standardPressure, ...pressureList);
  return (
    <>
      <h2>ちゃおハウスの天気</h2>
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
