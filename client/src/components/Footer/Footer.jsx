import './Footer.css';

const year = new Date().getFullYear();

export default function Footer() {

  return (
    <footer>
      <p> {year} | KeyType | All Rights Reserved</p>
    </footer>
 );
}