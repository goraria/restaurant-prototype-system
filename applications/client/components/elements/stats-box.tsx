import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeIconProps, StatsBoxProps } from "@/constants/interfaces";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function StatsBox({
  title,
  description,
  icon,
  color,
  stats,
}: StatsBoxProps) {
  const Icon = icon;

  const background = color ? `bg-${color}/24` : "bg-muted";
  const text = color ? `text-${color}` : "text-foreground";

  return (
    <>
      {0 ? (
        <>
          <Card className="h-36">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="">
                <span className="truncate">{/* text-sm font-medium */}
                  {title}
                </span>
                <p className="truncate text-xs text-muted-foreground">
                  {description}
                </p>
              </CardTitle>
              <Icon className={cn("h-4 w-4", text ? text : "text-muted-foreground")} />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", text ? text : "text-foreground")}>
                {stats}
              </div>
            </CardContent>
            {/*<CardFooter>*/}
            {/*  <div className="text-2xl font-bold">{stats.totalItems}</div>*/}
            {/*</CardFooter>*/}
          </Card>
        </>
      ) : (
        <>
          <Card className="p-6 gap-0">
            <div className="flex justify-between gap-1">
              <div className="flex flex-col gap-1 flex-grow">
                <p className="font-normal text-sm">
                  {title}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={cn("text-2xl font-medium", text)}>
                    {stats}
                  </h4>
                  {/*<p className="">*/}
                  {/*  (+29%)*/}
                  {/*</p>*/}
                </div>
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              </div>
              {/* <Badge className={cn("h-9 w-9 p-0 bg-professional-yellow/24")}> */}
              {/*<Badge className={cn("h-9 w-9 p-0", background)}>*/}
              {/*  <Icon style={{ width: 16, height: 16 }} className={cn("h-4 w-4", text)} />*/}
              {/*</Badge>*/}
              <BadgeIcon color={color} icon={icon} />
            </div>
          </Card>
        </>
      )}
    </>
  )
}

export function BadgeIcon({
  color,
  icon
}: BadgeIconProps) {
  const Icon = icon;
  
  // const background = color ? `bg-${color}/24` : "bg-muted";
  // const text = color ? `text-${color}` : "text-foreground";

  if (!color) {
    return (
      <Badge className="h-9 w-9 p-0 bg-muted">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-foreground" />
      </Badge>
    )
  } else if (color === "professional-blue") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-blue/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-blue" />
      </Badge>
    )
  } else if (color === "professional-indigo") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-indigo/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-indigo" />
      </Badge>
    )
  } else if (color === "professional-purple") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-purple/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-purple" />
      </Badge>
    )
  } else if (color === "professional-pink") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-pink/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-pink" />
      </Badge>
    )
  } else if (color === "professional-red") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-red/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-red" />
      </Badge>
    )
  } else if (color === "professional-orange") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-orange/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-orange" />
      </Badge>
    )
  } else if (color === "professional-yellow") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-yellow/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-yellow" />
      </Badge>
    )
  } else if (color === "professional-green") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-green/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-green" />
      </Badge>
    )
  } else if (color === "professional-teal") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-teal/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-teal" />
      </Badge>
    )
  } else if (color === "professional-cyan") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-cyan/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-cyan" />
      </Badge>
    )
  } else if (color === "professional-black") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-black/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-black" />
      </Badge>
    )
  } else if (color === "professional-white") {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-white/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-white" />
      </Badge>
    )
  } else {
    return (
      <Badge className="h-9 w-9 p-0 bg-professional-main/24">
        <Icon style={{ width: 16, height: 16 }} className="h-4 w-4 text-professional-main" />
      </Badge>
    )
  }

  // return (
  //   <Badge className={cn("h-9 w-9 p-0", background)}>
  //     <Icon style={{ width: 16, height: 16 }} className={cn("h-4 w-4", text)} />
  //   </Badge>
  // );
}
