import { twMerge } from "tailwind-merge";

export function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={twMerge("animate-pulse rounded-md bg-gray-300", className)}
      {...props}
    />
  )
}