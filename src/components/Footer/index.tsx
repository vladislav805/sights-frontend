import * as React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

const Footer = () => (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-menu">
                <Logo size={1.5} className="footer-logo" />
                <ul>
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/sight/map">Карта</Link></li>
                    <li><Link to="/sight/search">Поиск</Link></li>
                    <li><Link to="/page/guidelines">Гайдлайны</Link></li>
                </ul>
            </div>
            <div className="footer-copyright">
                <a href="//velu.ga/" target="_blank" rel="noopener noreferrer">velu.ga</a> &copy; 2015&ndash;2020
            </div>
        </div>
    </footer>
);

export default Footer;
