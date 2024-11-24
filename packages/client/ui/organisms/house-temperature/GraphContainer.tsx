import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ReferenceLineProps,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { WeatherData } from "../../../domain/WeatherData";

export interface GraphContainerProps {
  title: string;
  data: WeatherData[];
  dataKey: keyof WeatherData;
  domain: [number, number];
  referenceProps?: ReferenceLineProps[];
}

export const GraphContainer: React.FunctionComponent<GraphContainerProps> = ({
  title,
  data,
  dataKey,
  domain,
  referenceProps,
}: GraphContainerProps) => {
  return (
    <>
      <h3>{title}</h3>
      <ResponsiveContainer width="98%" height={400}>
        <LineChart data={data} syncId="chao">
          <Line type="monotone" dataKey={dataKey} />
          <XAxis
            dataKey="datetime"
            tickFormatter={(dateStringIso8601) => {
              const date = new Date(dateStringIso8601);
              return `${date.getHours()}:${date.getMinutes()}`;
            }}
            interval={59}
          />
          <YAxis domain={domain} />
          <CartesianGrid />
          {referenceProps?.map((props) => {
            return (
              <ReferenceLine
                {...props}
                key={typeof props.label === "string" ? props.label : ""}
              />
            );
          })}
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};
