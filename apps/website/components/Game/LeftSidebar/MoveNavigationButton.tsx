import Image from "next/image"
import classNames from "clsx"

import Arrow from "@/public/icons/arrow.svg"
import ArrowFull from "@/public/icons/arrow-full.svg"

export interface MoveNavigationButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  icon: "arrow" | "arrow-full"
  direction: "left" | "right"
}

export const MoveNavigationButton = (
  props: MoveNavigationButtonProps,
): JSX.Element => {
  const { icon, direction, ...rest } = props

  return (
    <button
      className="rounded-md bg-[#272522] px-4 py-1 hover:opacity-70"
      {...rest}
    >
      <Image
        className={classNames("h-4 w-4", {
          "rotate-180": direction === "left",
        })}
        quality={100}
        src={icon === "arrow" ? Arrow : ArrowFull}
        alt={`${icon} ${direction}`}
      />
    </button>
  )
}
