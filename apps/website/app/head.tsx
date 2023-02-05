const title = 'Carolo'
const description =
  "Le Carolo est un jeu de plateau stratégique, fait par la communauté, pour la communauté, qui allie autant l'aspect tactique que romantique !"
const image = 'https://carolo.org/home.png'
const url = 'https://carolo.org'

const Head = (): JSX.Element => {
  return (
    <>
      <title>{title}</title>
      <link rel='icon' type='image/png' href='/pieces/CAROLO_WHITE.png' />

      {/* Meta Tag */}
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta name='description' content={description} />
      <meta name='Language' content='fr' />

      {/* Open Graph Metadata */}
      <meta property='og:title' content={title} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={image} />
      <meta property='og:description' content={description} />
      <meta property='og:locale' content='fr_FR' />
      <meta property='og:site_name' content={title} />

      {/* Twitter Card Metadata */}
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:image' content={image} />
    </>
  )
}

export default Head
