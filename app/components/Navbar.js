import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';

// Initiates socket.io connection to display active listeners
// Home, Browse, Stats, Top 100

class Navbar extends React.Component {
    constructor(props) {
      super(props);
      // set initial state
      this.state = NavbarStore.getState();
      // need to bind this for any internal methods
      this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
      // subscribe to the Store, which will callback with store data
      NavbarStore.listen(this.onChange);
      NavbarActions.getCharacterCount();

      this.connectSocket();
    }

    connectSocket() {
      let socket = io.connect();
      socket.on('onlineUsers', (data) => {
          NavbarActions.updateOnlineUsers(data);
      });

      $(document).ajaxStart(() => { // called when first ajax req begins
          NavbarActions.updateAjaxAnimation('fadeIn');
      });

      $(document).ajaxComplete(() => {
          setTimeout(() => {
              NavbarActions.updateAjaxAnimation('fadeOut');
          }, 750);
      });
    }

    // search for characters
    handleSubmit(event) {
      event.preventDefault();
      let searchQuery = this.state.searchQuery.trim();
      if (searchQuery) {
          NavbarActions.findCharacter({
              searchQuery: searchQuery,
              // pass a ref to the DOM node to render shaking animation if not found
              searchForm: this.refs.searchForm.getDOMNode(),
              router: this.context.router
          });
      }
    }

    // any necessary cleanup, such as invalidating timers or unregistering listeners
    componentWillUnmount() {
      NavbarStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
      return (
        <nav className='navbar navbar-default navbar-static-top'>
            <div className='navbar-header'>
              <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
                <span className='sr-only'>Toggle navigation</span>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
              </button>
              <Link to='/' className='navbar-brand'>
                <span ref='triangles' className={'triangles animated ' + this.state.ajaxAnimationClass}>
                  <div className='tri invert'></div>
                  <div className='tri invert'></div>
                  <div className='tri'></div>
                  <div className='tri invert'></div>
                  <div className='tri invert'></div>
                  <div className='tri'></div>
                  <div className='tri invert'></div>
                  <div className='tri'></div>
                  <div className='tri invert'></div>
                </span>
                NEF
                <span className='badge badge-up badge-danger'>{this.state.onlineUsers}</span>
              </Link>
            </div>
            <div id='navbar' className='navbar-collapse collapse'>
                <form ref='searchForm' className='navbar-form navbar-left animated' onSubmit={this.handleSubmit.bind(this)}>
                    <div className='input-group'>
                        <input type='text' className='form-control' placeholder={this.state.totalCharacters + ' characters'} value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
                        <span className='input-group-btn'>
                        <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-search'></span></button>
                        </span>
                    </div>
                </form>
                <ul className='nav navbar-nav'>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/stats'>Stats</Link></li>
                    <li className='dropdown'>
                      <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Top 100 <span className='caret'></span></a>
                      <ul className='dropdown-menu'>
                        <li><Link to='/top'>Top Overall</Link></li>
                        <li className='dropdown-submenu'>
                          <Link to='/top/caldari'>Caldari</Link>
                          <ul className='dropdown-menu'>
                            <li><Link to='/top/caldari/achura'>Achura</Link></li>
                            <li><Link to='/top/caldari/civire'>Civire</Link></li>
                            <li><Link to='/top/caldari/deteis'>Deteis</Link></li>
                          </ul>
                        </li>
                        <li className='dropdown-submenu'>
                          <Link to='/top/gallente'>Gallente</Link>
                          <ul className='dropdown-menu'>
                            <li><Link to='/top/gallente/gallente'>Gallente</Link></li>
                            <li><Link to='/top/gallente/intaki'>Intaki</Link></li>
                            <li><Link to='/top/gallente/jin-mei'>Jin-Mei</Link></li>
                          </ul>
                        </li>
                        <li className='dropdown-submenu'>
                          <Link to='/top/minmatar'>Minmatar</Link>
                          <ul className='dropdown-menu'>
                            <li><Link to='/top/minmatar/brutor'>Brutor</Link></li>
                            <li><Link to='/top/minmatar/sebiestor'>Sebiestor</Link></li>
                            <li><Link to='/top/minmatar/vherokior'>Vherokior</Link></li>
                          </ul>
                        </li>
                        <li className='dropdown-submenu'>
                            <Link to='/top/amarr'>Amarr</Link>
                            <ul className='dropdown-menu'>
                                <li><Link to='/top/amarr/amarr'>Amarr</Link></li>
                                <li><Link to='/top/amarr/ni-kunni'>Ni-Kunni</Link></li>
                                <li><Link to='/top/amarr/khanid'>Khanid</Link></li>
                            </ul>
                        </li>
                        <li className='divider'></li>
                        <li><Link to='/shame'>Hall of Shame</Link></li>
                        </ul>
                    </li>
                    <li className='dropdown'>
                      <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Female <span className='caret'></span></a>
                      <ul className='dropdown-menu'>
                        <li><Link to='/female'>All</Link></li>
                        <li className='dropdown-submenu'>
                          <Link to='/female/caldari'>Caldari</Link>
                          <ul className='dropdown-menu'>
                            <li><Link to='/female/caldari/achura'>Achura</Link></li>
                            <li><Link to='/female/caldari/civire/'>Civire</Link></li>
                            <li><Link to='/female/caldari/deteis'>Deteis</Link></li>
                          </ul>
                        </li>
                        <li className='dropdown-submenu'>
                          <Link to='/female/gallente'>Gallente</Link>
                          <ul className='dropdown-menu'>
                            <li><Link to='/female/gallente/gallente'>Gallente</Link></li>
                            <li><Link to='/female/gallente/intaki'>Intaki</Link></li>
                            <li><Link to='/female/gallente/jin-mei'>Jin-Mei</Link></li>
                          </ul>
                        </li>
                        <li className='dropdown-submenu'>
                          <Link to='/female/minmatar'>Minmatar</Link>
                          <ul className='dropdown-menu'>
                            <li><Link to='/female/minmatar/brutor'>Brutor</Link></li>
                            <li><Link to='/female/minmatar/sebiestor'>Sebiestor</Link></li>
                            <li><Link to='/female/minmatar/vherokior'>Vherokior</Link></li>
                          </ul>
                        </li>
                        <li className='dropdown-submenu'>
                          <Link to='/female/amarr'>Amarr</Link>
                          <ul className='dropdown-menu'>
                            <li><Link to='/female/amarr/amarr'>Amarr</Link></li>
                            <li><Link to='/female/amarr/ni-kunni'>Ni-Kunni</Link></li>
                            <li><Link to='/female/amarr/khanid'>Khanid</Link></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li className='dropdown'>
                      <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Male <span className='caret'></span></a>
                      <ul className='dropdown-menu'>
                        <li><Link to='/male'>All</Link></li>
                        <li className='dropdown-submenu'>
                          <Link to='/male/caldari'>Caldari</Link>
                          <ul className='dropdown-menu'>
                            <li><Link to='/male/caldari/achura'>Achura</Link></li>
                            <li><Link to='/male/caldari/civire'>Civire</Link></li>
                            <li><Link to='/male/caldari/deteis'>Deteis</Link></li>
                          </ul>
                        </li>
                        <li className='dropdown-submenu'>
                          <Link to='/male/gallente'>Gallente</Link>
                          <ul className='dropdown-menu'>
                            <li><Link to='/male/gallente/gallente'>Gallente</Link></li>
                            <li><Link to='/male/gallente/intaki'>Intaki</Link></li>
                            <li><Link to='/male/gallente/jin-mei'>Jin-Mei</Link></li>
                          </ul>
                        </li>
                        <li className='dropdown-submenu'>
                          <Link to='/male/minmatar'>Minmatar</Link>
                          <ul className='dropdown-menu'>
                            <li><Link to='/male/minmatar/brutor'>Brutor</Link></li>
                            <li><Link to='/male/minmatar/sebiestor'>Sebiestor</Link></li>
                            <li><Link to='/male/minmatar/vherokior'>Vherokior</Link></li>
                          </ul>
                        </li>
                        <li className='dropdown-submenu'>
                          <Link to='/male/amarr'>Amarr</Link>
                          <ul className='dropdown-menu'>
                            <li><Link to='/male/amarr/amarr'>Amarr</Link></li>
                            <li><Link to='/male/amarr/ni-kunni'>Ni-Kunni</Link></li>
                            <li><Link to='/male/amarr/khanid'>Khanid</Link></li>
                          </ul>
                        </li>
                        </ul>
                    </li>
                    <li><Link to='/add'>Add</Link></li>
                </ul>
            </div>
        </nav>
    );
  }
}

// necessary for referencing  an instance of the router, which in turn gives us access to current path, current query parameters, route parameters and transitions to other routes
// pass as argument to Navbar actions so that it can navigate to character profile pages after fetching data
Navbar.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Navbar;
