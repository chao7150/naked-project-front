import { useCallback } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeatherData } from "../../../domain/WeatherData";

interface ReferenceProps {
  y: number;
  label?: string;
  stroke?: string;
}

export interface GraphContainerProps {
  title: string;
  data: WeatherData[];
  dataKey: keyof WeatherData;
  domain: [number, number];
  referenceProps?: ReferenceProps[];
  yAxisTickFormatter?: (value: number) => string;
}

export const GraphContainer = ({
  title,
  data,
  dataKey,
  domain,
  referenceProps,
  yAxisTickFormatter = (value: number) => Math.round(value).toString(),
}: GraphContainerProps) => {
  const formatTooltip = useCallback(
    (value: number | string | readonly (number | string)[] | undefined) => {
      if (typeof value === "number") {
        return value.toFixed(2);
      }
      return value ?? "";
    },
    [],
  );

  return (
    <section>
      <h3>{title}</h3>
      <ResponsiveContainer width="98%" height={400}>
        <LineChart data={data} syncId="chao">
          <Line type="monotone" dataKey={dataKey} />
          <XAxis dataKey="datetime" interval={59} />
          <YAxis domain={domain} tickFormatter={yAxisTickFormatter} />
          <CartesianGrid />
          {referenceProps?.map((props) => {
            return <ReferenceLine {...props} key={props.label} />;
          })}
          <Tooltip
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: "var(--bg-color)",
              borderColor: "var(--text-color)",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};
