"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Th1",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Th2",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Th3",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Th4",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Th5",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Th6",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Th7",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Th8",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Th9",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Th10",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Th11",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Th12",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
