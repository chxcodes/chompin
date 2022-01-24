import type { NextPage } from 'next'
import dynamic from 'next/dynamic';
import Head from 'next/head'

const GameBoard = dynamic(() => import('../../components/Game/GameBoard'), { ssr: false });


const Game: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Always Chompin</title>
        <meta name="description" content="" />
      </Head>

      <main>
        <GameBoard>
            
        </GameBoard>
      </main>
    </div>
  )
}

export default Game
