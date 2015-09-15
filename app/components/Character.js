import React from 'react';
import CharacterStore from '../stores/CharacterStore';
import CharacterActions from '../actions/CharacterActions'

class Character extends React.Component {
  constructor(props) {
    super(props);

    this.state = CharacterStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    CharacterStore.listen(this.onChange);

    CharacterActions.getCharacter(this.props.params.id);

    $('.magnific-popup').magnificPopup({
       type: 'image',
       mainClass: 'mfp-zoom-in',
       closeOnContentClick: true,
       midClick: true,
       zoom: {
         enabled: true,
         duration: 300
       }
    });
  }

  componentWillUnmount() {
    CharacterStore.unlisten(this.onChange);

    // remove full-page bg image when navigating back
    $(document.body).removeClass();
  }

  // not called for the initial render, only when updated
  // transitioning from char to char means component is never unmounted
  // this is called if we are in this component and URL changes
  componentDidUpdate(prevProps, prevState) {
    // Fetch new character data when URL path changes
    if (this.props.params.id !== prevProps.params.id) {
      CharacterActions.getCharacter(this.props.params.id);
    }

    if (this.state.race !== prevState.race) {
      $(document.body).attr('class', 'profile ' + this.state.race.toLowerCase());
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container'>
        <div className='profile-img'>
          <a className='magnific-popup' href={'https://image.eveonline.com/Character/' + this.state.characterId + '_1024.jpg'}>
            <img src={'https://image.eveonline.com/Character/' + this.state.characterId + '_256.jpg'} />
          </a>
        </div>
        <div className='profile-info clearfix'>
          <h2><strong>{this.state.name}</strong></h2>
          <h4 className='lead'>Race: <strong>{this.state.race}</strong></h4>
          <h4 className='lead'>Bloodline: <strong>{this.state.bloodline}</strong></h4>
          <h4 className='lead'>Gender: <strong>{this.state.gender}</strong></h4>
          <button className='btn btn-transparent'
                  onClick={CharacterActions.report.bind(this, this.state.characterId)}
                  disabled={this.state.isReported}>
            {this.state.isReported ? 'Reported' : 'Report Character'}
          </button>
        </div>
        <div className='profile-stats clearfix'>
          <ul>
            <li><span className='stats-number'>{this.state.winLossRatio}</span>Winning Percentage</li>
            <li><span className='stats-number'>{this.state.wins}</span> Wins</li>
            <li><span className='stats-number'>{this.state.losses}</span> Losses</li>
          </ul>
        </div>
      </div>
    );
  }
}

Character.contextTypes = {
  router: React.PropTypes.func.isRequired
};

Character.propTypes = {
  // from react router `characters/:id`
  params: React.PropTypes.object.isRequired
};

export default Character;
