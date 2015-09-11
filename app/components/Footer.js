import React from 'react';
import {Link} from 'react-router';
import FooterStore from '../stores/FooterStore';
import FooterActions from '../actions/FooterActions';

// Fetches and displays the Top 5 characters.
class Footer extends React.Component {
    constructor(props) {
        super(props);
        // set initial state
        this.state = FooterStore.getState();
        // need to bind this for any internal methods
        this.onChange = this.onChange.bind(this);
    }

    // invoked once on initial render, only on client, has DOM 
    // send AJAX requests, register store listeners, integrate with other JS
    componentDidMount() {
        // subscribe to the Store, which will callback with store data
        FooterStore.listen(this.onChange);

        // fire off AJAX request
        FooterActions.getTopCharacters();
    }

    // any necessary cleanup, such as invalidating timers or unregistering listeners
    componentWillUnmount() {
        FooterStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        // li item with links - dynamic children required to have keys
        let leaderboardCharacters;
        if (Array.isArray(this.state.characters)) {
            leaderboardCharacters = this.state.characters.map((character) => {
              return (
                <li key={character.characterId}>
                {/* Link auto applies 'active' CSS class */}
                  <Link to={'/characters/' + character.characterId}>
                    <img className='thumb-md' src={'http://image.eveonline.com/Character/' + character.characterId + '_128.jpg'} />
                  </Link>
                </li>
              )
            });
        }
        
        return (
          <footer>
            <div className='container'>
              <div className='row'>
                <div className='col-sm-5'>
                    <h3 className='lead'><strong>Footer</strong></h3>
                </div>
                <div className='col-sm-7 hidden-xs'>
                  <h3 className='lead'><strong>Leaderboard</strong> Top 5 Characters</h3>
                  <ul className='list-inline'>
                    {leaderboardCharacters}
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        );
    }
}

export default Footer;
