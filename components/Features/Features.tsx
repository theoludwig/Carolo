import { Feature } from './Feature'

export const Features = (): JSX.Element => {
  return (
    <section className='mt-8 flex w-full flex-wrap justify-evenly'>
      <Feature
        title='Dynamique'
        icon='/feature-icons/run.png'
        description='Le Carolo est un jeu dynamique qui saura plaire aux joueurs audacieux.'
      />
      <Feature
        title='Stratégique'
        icon='/feature-icons/brain.png'
        description='Le Carolo est un jeu tactique qui comporte des combinaisons grandioses !'
      />
      <Feature
        title='Innovant'
        icon='/feature-icons/innovation.png'
        description='Le Carolo est un jeu original comportant des nouvelles mécaniques.'
      />
      <Feature
        title='Subjuguant'
        icon='/feature-icons/book.png'
        description='Le Carolo est un jeu envoûtant qui comporte une histoire dont le joueur est le héros.'
      />
    </section>
  )
}
