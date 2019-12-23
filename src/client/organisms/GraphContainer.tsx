import * as React from "react";
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
import { Data } from "../consts/Data";

export interface GraphContainerProps {
  title: string;
  data: Data[];
  dataKey: keyof Data;
  domain: [number, number];
  referenceProps?: ReferenceLineProps;
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
      <h2>{title}</h2>
      <ResponsiveContainer width="90%" height={400}>
        <LineChart data={data} syncId="chao">
          <Line type="monotone" dataKey={dataKey} />
          <XAxis dataKey="time" interval={59} />
          <YAxis domain={domain} />
          <CartesianGrid />
          <ReferenceLine {...referenceProps} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};
