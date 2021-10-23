import React, {useEffect, useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom'
import {Typography} from "@material-ui/core";
import "../styles/navbar.css";
import { useLocation } from 'react-router-dom';

const getLinkIdxByPathName = (location, navLinks) => {
    for (let i = 0; navLinks && i < navLinks.length; i++) {
        if (navLinks[i].link === location) {
            return i;
        }
    }
    return -1;
}

export function NavBar() {
    const [root, setRoot] = useState('/');
    const [navColour, updateNavbar] = useState(false);
    const [expand, updateExpanded] = useState(false);
    const location = useLocation().pathname;
    const history = useHistory();

    const getTitle = (x) => x.startsWith('/ecess') ? undefined : (x.startsWith('/wece') ? 'Women in ECE': 'Ambassadors');

    const [title, setTitle] = useState(getTitle(location));
    const setECESSPage = () => {
        setTitle(undefined);
        setNavLinks(ECESS_NAV_LINKS);
    }
    const setAmbassadorPage = () => {
        setRoot('/');
        setTitle('Ambassadors');
        setNavLinks(AMBASSADOR_NAV_LINKS);
    }
    const setWECEPage = () => {
        setRoot('/wece');
        setTitle("Women in ECE");
        setNavLinks(WECE_NAV_LINKS);
    }
    const AMBASSADOR_NAV_LINKS =  [
        {link: '/calendar', label: 'Calendar', onClick:  setAmbassadorPage},
        {link: '/fun', label: 'Fun', onClick:  setAmbassadorPage},
        {link: '/ece', label: 'ECE', onClick:  setAmbassadorPage},
        {link: '/members', label: 'Members', onClick:  setAmbassadorPage},
    ];
    const ECESS_NAV_LINKS = [
        {link: '/ecess/board', label: 'Board', onClick:  setECESSPage},
        {link: '/ecess/committees', label: 'Committees', onClick:  setECESSPage},
        {link: '/wece', label: 'WECE', onClick: () => {
                setWECEPage();
                setLinkIdx(-1);
            }
        },
        {link: '/', label: 'Ambassadors', onClick:  () => {
                setAmbassadorPage();
                setLinkIdx(-1);
            }
        }
    ]
    const WECE_NAV_LINKS = [
        {link: '/wece/members', label: 'Members', onClick: setWECEPage},
        {link: '/wece/resources', label: 'Resources', onClick: setWECEPage}
    ]
    const getNavLinks = (x) => x.startsWith('/ecess') ? ECESS_NAV_LINKS : (x.startsWith('/wece') ? WECE_NAV_LINKS: AMBASSADOR_NAV_LINKS);
    const [navLinks, setNavLinks] = useState(getNavLinks(location));

    const [linkIdx, setLinkIdx] = useState(getLinkIdxByPathName(location, navLinks));

    function scrollHandler() {
        if (window.scrollY >= 20) {
            updateNavbar(true);
        } else {
            updateNavbar(false);
        }
    }

    window.addEventListener("scroll", scrollHandler);

    useEffect(() => {
        return history.listen(location => {
            const pathname = location.pathname;
            const navLinks = getNavLinks(pathname);
            setTitle(getTitle(pathname));
            setNavLinks(getNavLinks(pathname));
            setLinkIdx(getLinkIdxByPathName(pathname, navLinks));
        })
    }, [getNavLinks, history])

    return (
        <Navbar
            expanded={expand}
            expand="md"
            className={navColour ? "sticky" : "navbar"}
            style={{padding: 0, margin: 0, backgroundColor: '#CEB888'}}
        >
            <Container>
                <Navbar.Brand href="/">
                    <Typography>ECESS</Typography>
                </Navbar.Brand>
                <Navbar.Toggle
                    aria-controls="responsive-navbar-nav"
                    onClick={() => {
                        updateExpanded(!expand);
                    }}
                >
                </Navbar.Toggle>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto" defaultActiveKey="#home">
                        {title ?
                            <Nav.Item>
                                <Nav.Link
                                    className="hover-underline-animation"
                                    as={Link}
                                    to={root}
                                    onClick={() => {
                                        setLinkIdx(-1);
                                        updateExpanded(false)
                                    }}
                                >
                                    <Typography style={{fontWeight: (linkIdx === -1 ? "bold": undefined)}}>
                                        {title}
                                    </Typography>
                                </Nav.Link>
                            </Nav.Item>: <></>
                        }

                        {navLinks ? navLinks.map((i, idx) => (
                            <Nav.Item key={i.link}>
                                <Nav.Link
                                    className="hover-underline-animation"
                                    as={Link}
                                    to={i.link}
                                    onClick={() => {
                                        setLinkIdx(idx);
                                        i.onClick();
                                        updateExpanded(false);
                                    }}
                                >
                                    <Typography style={{fontWeight: (linkIdx === idx ? "bold": undefined)}}>
                                        {i.label}
                                    </Typography>
                                </Nav.Link>
                            </Nav.Item>
                        )): <></>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

