import { cookies } from "next/headers"
import type { TokensJWT, UserCurrent } from "@carolo/models"

import { Header } from "@/components/Header/Header"
import type { SigninResult } from "@/lib/Authentication"
import { Authentication } from "@/lib/Authentication"
import { AuthenticationStoreInitializer } from "@/stores/AuthenticationStoreInitializer"

import "@fontsource/inter/200.css"
import "@fontsource/inter/400.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/700.css"

import "@fontsource/goldman/400.css"
import "@fontsource/goldman/700.css"

import "./globals.css"

export type RootLayoutProps = React.PropsWithChildren

export const dynamic = "force-dynamic"

const title = "Carolo"
const description =
  "Le Carolo est un jeu de plateau stratégique similaire aux échecs qui permet des coups grandioses, reposant sur des enchaînements remarquables."
const image = "/home.png"
const url = new URL("https://carolo.theoludwig.fr")
const locale = "fr-FR"

export const metadata = {
  title,
  description,
  colorScheme: "dark",
  metadataBase: url,
  openGraph: {
    title,
    description,
    url,
    siteName: title,
    images: [
      {
        url: image,
        width: 794,
        height: 446,
      },
    ],
    locale,
    type: "website",
  },
  icons: {
    icon: "/pieces/CAROLO_WHITE.png",
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [image],
  },
}

const RootLayout = async (props: RootLayoutProps): Promise<JSX.Element> => {
  const { children } = props

  const cookieStore = cookies()
  const refreshToken = cookieStore.get("refreshToken")

  let tokens: TokensJWT | null = null
  let user: UserCurrent["user"] | null = null
  let result: SigninResult | null = null
  result = await Authentication.signin(refreshToken?.value)
  tokens = result?.tokens ?? null
  user = result?.user ?? null

  return (
    <html lang={locale} className="dark" style={{ colorScheme: "dark" }}>
      <head />
      <body className="font-inter flex min-h-screen flex-col bg-[#312E2B] pt-0">
        <AuthenticationStoreInitializer tokens={tokens} user={user} />
        <Header />
        {children}
      </body>
    </html>
  )
}

export default RootLayout
