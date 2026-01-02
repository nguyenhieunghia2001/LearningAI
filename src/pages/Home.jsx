import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => (
  <>
    <Header />
    <main style={{ padding: '1rem' }}>
      <h2>Home</h2>
      <p>Welcome to the Home page.</p>
    </main>
    <Footer />
  </>
);

export default Home;
