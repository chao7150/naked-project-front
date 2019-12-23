import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

export interface Data {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

interface Props {
  data: Data[];
}

export const App: React.FunctionComponent = () => {
  const [data, setData] = useState<Data[]>([]);
  useEffect(() => {
    const fetch = async (): Promise<void> => {
      const result = await axios.get(
        "https://gyokuro.chao.tokyo/api/temperature",
      );
      setData(result.data.data as Data[]);
    };
    fetch();
  }, []);

  const standardPressure = 1013;
  const pressureList = data.map(({ pressure }) => pressure);
  const minPressure = Math.min(standardPressure, ...pressureList);
  const maxPressure = Math.max(standardPressure, ...pressureList);

  return (
    <>
      <h1>今日のちゃおハウス</h1>
      <p>
        <a href="https://github.com/chao7150/house-temperature-web">
          ソースコード
        </a>
      </p>
      <h2>気温</h2>
      <ResponsiveContainer width="90%" height={400}>
        <LineChart data={data} syncId="chao">
          <Line type="monotone" dataKey="temperature" />
          <XAxis dataKey="time" interval={59} />
          <YAxis domain={[0, 40]} />
          <CartesianGrid />
          <ReferenceLine y={17} label="↓違法" stroke="red" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
      <h2>湿度</h2>
      <ResponsiveContainer width="90%" height={400}>
        <LineChart data={data} syncId="chao">
          <Line type="monotone" dataKey="humidity" />
          <XAxis dataKey="time" interval={59} />
          <YAxis domain={[0, 70]} />
          <CartesianGrid />
          <ReferenceLine y={40} label="↓違法" stroke="red" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
      <h2>気圧</h2>
      <ResponsiveContainer width="90%" height={400}>
        <LineChart data={data} syncId="chao">
          <Line type="monotone" dataKey="pressure" />
          <XAxis dataKey="time" interval={59} />
          <YAxis domain={[minPressure, maxPressure]} />
          <CartesianGrid />
          <ReferenceLine y={standardPressure} label="標準気圧" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};
