import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './Home.css';
import logo from '../../assets/logo.svg';

const Home : React.FC = () => {
  return(
  <>
    <div id="page-home">
        <div className="content">

            <header>
                <img src={logo} alt="Ecoleta"/>
            </header>

            <main>
                <h1>Seu Marketplace de coleta de resíduos</h1>
                
                <p>Ajudamos pessoasa encontrarem pontos de coleta de forma eficiente.</p>

                <Link to="/create-point">
                    <span><FiLogIn /></span>
                    <strong>Castre um ponto de coleta</strong>
                </Link>
            </main>


        </div>
    </div>
  </>
  );
}

export default Home;