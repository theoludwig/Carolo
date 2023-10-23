import Image from "next/image"
import NextLink from "next/link"

import Icon from "@/public/icon.svg"
import { HeaderLink } from "@/components/Header/HeaderLink"
import { HeaderAuthentication } from "@/components/Header/HeaderAuthentication"

export const Header = (): JSX.Element => {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-center bg-[#171717] px-4 py-1">
      <div className="flex w-full flex-wrap items-center justify-between gap-y-4">
        <NextLink href="/" className="mr-5">
          <section className="flex items-center">
            <Image src={Icon} priority quality={100} alt="Carolo" />
            <div className="ml-2">
              <h1 className="font-goldman text-3xl font-bold leading-7">
                Carolo
              </h1>
            </div>
          </section>
        </NextLink>

        <nav>
          <ul className="flex space-x-6 font-semibold">
            <li>
              <HeaderLink href="/game">Jouer</HeaderLink>
            </li>
            <li>
              <HeaderLink
                href="/rules/carolo-fr-FR.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Règles
              </HeaderLink>
            </li>
          </ul>
        </nav>

        <HeaderAuthentication />
      </div>
    </header>
  )
}
