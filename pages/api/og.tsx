import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

const font = fetch(
  new URL("../../assets/BebasNeue-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const year = searchParams.get("year");
  const day = searchParams.get("day");
  const fontData = await font;

  const data = await fetch(
    "https://raw.githubusercontent.com/Uptip/advent-of-code/main/data/stats.json"
  ).then((res) => res.json());
  const dayData = data?.[year as string]?.[day as string];

  return new ImageResponse(
    (
      <div
        tw="flex flex-col justify-center items-center w-full h-full"
        style={{
          backgroundImage: `url('https://advent-of-tiles.vercel.app/2022${
            Number(day) % 2 ? "-even" : "-odd"
          }${!dayData ? "-disabled" : ""}.svg')`,
          fontFamily: "Bebas",
        }}
      >
        <div
          tw="text-white text-[128px] font-bold leading-[1em] -mt-4"
          style={{ textShadow: "0 4px 8px rgba(0,0,0,0.24)" }}
        >
          {`${day}`.padStart(2, "0")}
        </div>
        {dayData?.partOneTime && (
          <div tw="flex flex-row w-full justify-center gap-4 px-2 -mt-4">
            <div tw="flex flex-col flex-1 items-center justify-center px-4">
              <div
                tw="text-[40px]"
                style={{ textShadow: "0 4px 8px rgba(0,0,0,0.24)" }}
              >
                ⭐
              </div>
              <div
                tw="text-white text-3xl"
                style={{ textShadow: "0 4px 8px rgba(0,0,0,0.24)" }}
              >
                {dayData.partOneTime}
              </div>
            </div>
            {Boolean(dayData?.partTwoTime) && (
              <div tw="flex flex-col flex-1 items-center justify-center px-2">
                <div
                  tw="text-[40px]"
                  style={{ textShadow: "0 4px 8px rgba(0,0,0,0.24)" }}
                >
                  ⭐
                </div>
                <div
                  tw="text-white text-3xl"
                  style={{ textShadow: "0 4px 8px rgba(0,0,0,0.24)" }}
                >
                  {dayData.partTwoTime}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    ),
    {
      width: 240,
      height: 240,
      emoji: "noto",
      fonts: [
        {
          name: "Bebas",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
