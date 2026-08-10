import { GoogleFonts } from "veryfront/fonts"
import { Head } from "veryfront/head"
import { ThemeProvider } from "https://esm.sh/next-themes"

export default function App(props) {
  return (
    <>
      <Head>
        <title>Veryfront App</title>
      </Head>
      <GoogleFonts
        fonts={[
          {
            name: "Inter",
            weights: [300, 400, 500, 600, 700],
            italics: true,
            variable: "--font-body",
          },
        ]}
      />
      <ThemeProvider>{props.children}</ThemeProvider>
    </>
  )
}
