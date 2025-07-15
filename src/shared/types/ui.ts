import type React from "react";
// UI 관련 타입 정의
export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "search" | "date" | "multiselect";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface ChartConfig {
  type: "line" | "bar" | "area" | "pie";
  data: any[];
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
}

export interface NotificationConfig {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: "default" | "destructive";
}

export interface ThemeConfig {
  mode: "light" | "dark" | "system";
  primaryColor: string;
  borderRadius: number;
}
