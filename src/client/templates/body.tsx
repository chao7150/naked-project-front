import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { GraphContainer } from "../organisms/GraphContainer";
import { Data } from "../consts/Data";
import { Header } from "../organisms/Header";

export const App: React.FunctionComponent = () => {
  const [data, setData] = useState<Data[]>([]);
  useEffect(() => {
    const fetch = async (): Promise<void> => {
      // API叩く処理がUIの中にあるのはなんか気持ち悪い
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
