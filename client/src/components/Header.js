import React, { Component } from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem, NavLink } from 'reactstrap'
import { NavLink as RRNavLink, Link } from "react-router-dom";
import logo from '../assets/peloton_past_200x200_trans.png'

export default class Header extends Component {

    render() {
        return (
            <div>
                <Navbar dark expand='md' className="header">
                    <NavbarBrand className="header-brand">
                    <img src={logo} alt="" />
                    Peloton Past
                    </NavbarBrand>
                    <NavbarToggler onClick={function noRefCheck(){}} />
                    <Collapse navbar>
                        <Nav className="ms-auto" navbar>
                            <NavItem>
                                <NavLink tag={RRNavLink} to="/workouts" 
                                    className={isActive =>  "nav-link" + (isActive ? " active" : "") }
                                    >
                                    Workouts
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={RRNavLink} to="/stats" 
                                 className={isActive => "nav-link" + (isActive ? " active" : "") }
                                 >
                                    Stats
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <NavbarText className="ms-4 me-2">
                            <Link to="/profile">
                                <img className="rounded-circle header-profile-picture" src={this.props.profile_image} alt="profile"/>
                            </Link>
                        </NavbarText>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}