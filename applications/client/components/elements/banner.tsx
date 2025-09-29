"use client"

import React from "react";

export function BannerBasic({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <div className="bg-gradient-to-r from-professional-main to-professional-sub rounded-xl text-white py-18">
        <div className="flex flex-col gap-6 text-center">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-xl opacity-90">{description}</p>
        </div>
      </div>
    </>
  )
}

export function BannerCarousel() {
  return (
    <>

    </>
  )
}