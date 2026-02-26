// Mock for Recharts components
import React from 'react';

export const ResponsiveContainer = ({ children }) => <div data-testid="responsive-container">{children}</div>;
export const LineChart = ({ children }) => <div data-testid="line-chart">{children}</div>;
export const Line = () => <div data-testid="line" />;
export const XAxis = () => <div data-testid="x-axis" />;
export const YAxis = () => <div data-testid="y-axis" />;
export const CartesianGrid = () => <div data-testid="cartesian-grid" />;
export const Tooltip = () => <div data-testid="tooltip" />;
export const Legend = () => <div data-testid="legend" />;
export const BarChart = ({ children }) => <div data-testid="bar-chart">{children}</div>;
export const Bar = () => <div data-testid="bar" />;
export const PieChart = ({ children }) => <div data-testid="pie-chart">{children}</div>;
export const Pie = () => <div data-testid="pie" />;
export const Cell = () => <div data-testid="cell" />;
