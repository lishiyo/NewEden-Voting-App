(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

// instantiate Flux dispatcher

var AddCharacterActions = (function () {
    function AddCharacterActions() {
        _classCallCheck(this, AddCharacterActions);

        this.generateActions('addCharacterSuccess', 'addCharacterFail', 'updateName', 'updateGender', 'invalidName', 'invalidGender');
    }

    _createClass(AddCharacterActions, [{
        key: 'addCharacter',
        value: function addCharacter(name, gender) {
            var _this = this;

            // hit express server POST /api/characters
            $.ajax({
                type: 'POST',
                url: '/api/characters',
                data: { name: name, gender: gender }
            }).done(function (data) {
                _this.actions.addCharacterSuccess(data.message);
            }).fail(function (jqXhr) {
                _this.actions.addCharacterFail(jqXhr.responseJSON.message);
            });
        }
    }]);

    return AddCharacterActions;
})();

exports['default'] = _alt2['default'].createActions(AddCharacterActions);
module.exports = exports['default'];

},{"../alt":8}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var CharacterActions = (function () {
  function CharacterActions() {
    _classCallCheck(this, CharacterActions);

    this.generateActions('reportSuccess', 'reportFail', 'getCharacterSuccess', 'getCharacterFail');
  }

  _createClass(CharacterActions, [{
    key: 'report',
    value: function report(characterId) {
      var _this = this;

      $.ajax({
        type: 'POST',
        url: '/api/post',
        data: { characterId: characterId }
      }).done(function (data) {
        _this.actions.reportSuccess();
      }).fail(function (jqXhr) {
        _this.actions.reportFail(jqXhr);
      });
    }
  }, {
    key: 'getCharacter',
    value: function getCharacter(characterId) {
      var _this2 = this;

      var url = '/api/characters/' + characterId;
      $.ajax({ url: url }).done(function (data) {
        _this2.actions.getCharacterSuccess(data);
      }).fail(function (jqXhr) {
        _this2.actions.getCharacterFail(data);
      });
    }
  }]);

  return CharacterActions;
})();

exports['default'] = _alt2['default'].createActions(CharacterActions);
module.exports = exports['default'];

},{"../alt":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _underscore = require('underscore');

var CharacterListActions = (function () {
    function CharacterListActions() {
        _classCallCheck(this, CharacterListActions);

        this.generateActions('getCharactersSuccess', 'getCharactersFail');
    }

    _createClass(CharacterListActions, [{
        key: 'getCharacters',
        value: function getCharacters(params) {
            var _this = this;

            // { race, bloodline, category }
            var url = '/api/characters/top';
            var paramsData = (0, _underscore.pick)(params, 'race', 'bloodline');

            if ((0, _underscore.has)(params, 'category')) {
                switch (params.category) {
                    case 'female':
                        (0, _underscore.assign)(paramsData, { gender: 'female' });
                        break;
                    case 'male':
                        (0, _underscore.assign)(paramsData, { gender: 'male' });
                        break;
                    case 'shame':
                        url = '/api/characters/shame';
                        break;
                }
            }

            $.ajax({
                url: url,
                data: paramsData
            }).done(function (data) {
                _this.actions.getCharactersSuccess(data);
            }).fail(function (jqXhr) {
                _this.actions.getCharactersFail(data);
            });
        }
    }]);

    return CharacterListActions;
})();

exports['default'] = _alt2['default'].createActions(CharacterListActions);
module.exports = exports['default'];

},{"../alt":8,"underscore":"underscore"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

// instantiate Flux dispatcher

var FooterActions = (function () {
    function FooterActions() {
        _classCallCheck(this, FooterActions);

        // straight-through dispatch - `this.dispatch(payload)` to a store
        this.generateActions(
        // update store, re-render component with new data
        'getTopCharactersSuccess',
        // display error notification
        'getTopCharactersFail');
    }

    // view actions - call this from components

    _createClass(FooterActions, [{
        key: 'getTopCharacters',
        value: function getTopCharacters() {
            var _this = this;

            $.ajax({ url: '/api/characters/top' }).done(function (data) {
                // when getTopCharactersSuccess(payload) is fired =>
                // dispatcher notifies all registered subscribers (store callbacks)
                _this.actions.getTopCharactersSuccess(data);
            }).fail(function (jqXhr) {
                _this.actions.getTopCharactersFail(jqXhr);
            });
        }
    }]);

    return FooterActions;
})();

exports['default'] = _alt2['default'].createActions(FooterActions);
module.exports = exports['default'];

},{"../alt":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var HomeActions = (function () {
  function HomeActions() {
    _classCallCheck(this, HomeActions);

    this.generateActions('getTwoCharactersSuccess', 'getTwoCharactersFail', 'voteFail');
  }

  _createClass(HomeActions, [{
    key: 'getTwoCharacters',
    value: function getTwoCharacters() {
      var _this = this;

      $.ajax({ url: '/api/characters' }).done(function (data) {
        _this.actions.getTwoCharactersSuccess(data);
      }).fail(function (jqXhr) {
        _this.actions.getTwoCharactersFail(jqXhr.responseJSON.message);
      });
    }
  }, {
    key: 'vote',
    value: function vote(winnerId, loserId) {
      var _this2 = this;

      $.ajax({
        type: 'PUT',
        url: '/api/characters',
        data: { winnerId: winnerId, loserId: loserId }
      }).done(function () {
        _this2.actions.getTwoCharacters();
      }).fail(function (jqXhr) {
        _this2.actions.voteFail(jqXhr.responseJSON.message);
      });
    }
  }]);

  return HomeActions;
})();

exports['default'] = _alt2['default'].createActions(HomeActions);
module.exports = exports['default'];

},{"../alt":8}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

// instantiate Flux dispatcher

var _underscore = require('underscore');

// merge with overwrite from right

var NavbarActions = (function () {
    function NavbarActions() {
        _classCallCheck(this, NavbarActions);

        this.generateActions(
        // Sets online users count on Socket.IO event update.
        'updateOnlineUsers',
        // Adds "fadeIn" or "fadeOut" CSS class to the loading indicator.
        'updateAjaxAnimation',
        // Update search query value on keypress.
        'updateSearchQuery',
        // ajax callbacks
        'getCharacterCountSuccess', 'getCharacterCountFail', 'findCharacterSuccess', 'findCharacterFail');
    }

    // Fetch total number of characters from the server.

    _createClass(NavbarActions, [{
        key: 'getCharacterCount',
        value: function getCharacterCount() {
            var _this = this;

            $.ajax({
                url: '/api/characters/count'
            }).done(function (data) {
                _this.actions.getCharacterCountSuccess(data.count);
            }).fail(function (jqXhr) {
                _this.actions.getCharacterCountFail(jqXhr);
            });
        }

        // { searchQuery, searchForm, router }
    }, {
        key: 'findCharacter',
        value: function findCharacter(payload) {
            var _this2 = this;

            $.ajax({
                url: '/api/characters/search',
                data: { name: payload.searchQuery }
            }).done(function (data) {
                // character
                (0, _underscore.assign)(payload, data);
                console.log("findCharacter success", payload);
                _this2.actions.findCharacterSuccess(payload);
            }).fail(function () {
                _this2.actions.findCharacterFail(payload);
            });
        }
    }]);

    return NavbarActions;
})();

exports['default'] = _alt2['default'].createActions(NavbarActions);
module.exports = exports['default'];

},{"../alt":8,"underscore":"underscore"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

// instantiate Flux dispatcher

var StatsActions = (function () {
    function StatsActions() {
        _classCallCheck(this, StatsActions);

        this.generateActions('getStatsSuccess', 'getStatsFail');
    }

    _createClass(StatsActions, [{
        key: 'getStats',
        value: function getStats() {
            var _this = this;

            $.ajax({
                url: '/api/stats'
            }).done(function (data) {
                _this.actions.getStatsSuccess(data);
            }).fail(function (jqXhr) {
                _this.actions.getStatsFail(jqXhr);
            });
        }
    }]);

    return StatsActions;
})();

exports['default'] = _alt2['default'].createActions(StatsActions);
module.exports = exports['default'];

},{"../alt":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _alt = require('alt');

var _alt2 = _interopRequireDefault(_alt);

// singleton
exports['default'] = new _alt2['default']();
module.exports = exports['default'];

},{"alt":"alt"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storesAddCharacterStore = require('../stores/AddCharacterStore');

var _storesAddCharacterStore2 = _interopRequireDefault(_storesAddCharacterStore);

var _actionsAddCharacterActions = require('../actions/AddCharacterActions');

var _actionsAddCharacterActions2 = _interopRequireDefault(_actionsAddCharacterActions);

var AddCharacter = (function (_React$Component) {
  _inherits(AddCharacter, _React$Component);

  function AddCharacter(props) {
    _classCallCheck(this, AddCharacter);

    _get(Object.getPrototypeOf(AddCharacter.prototype), 'constructor', this).call(this, props);

    // set initial state
    this.state = _storesAddCharacterStore2['default'].getState();

    // alias callbacks
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  _createClass(AddCharacter, [{
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      event.preventDefault();

      var name = this.state.name.trim();
      var gender = this.state.gender;

      if (!name) {
        _actionsAddCharacterActions2['default'].invalidName();
        // <input type='text' ref='nameTextField' ... />
        // if invalid, focus on the input field
        this.refs.nameTextField.getDOMNode().focus();
      }

      if (!gender) {
        _actionsAddCharacterActions2['default'].invalidGender();
      }

      if (name && gender) {
        _actionsAddCharacterActions2['default'].addCharacter(name, gender);
      }
    }

    // bind listeners
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      _storesAddCharacterStore2['default'].listen(this.onChange);
    }

    // unbind listeners
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _storesAddCharacterStore2['default'].unlisten(this.onChange);
    }
  }, {
    key: 'onChange',
    value: function onChange(state) {
      this.setState(state);
    }
  }, {
    key: 'render',
    value: function render() {

      return _react2['default'].createElement(
        'div',
        { className: 'container' },
        _react2['default'].createElement(
          'div',
          { className: 'row flipInX animated' },
          _react2['default'].createElement(
            'div',
            { className: 'col-sm-8' },
            _react2['default'].createElement(
              'div',
              { className: 'panel panel-default' },
              _react2['default'].createElement(
                'div',
                { className: 'panel-heading' },
                'Add Character'
              ),
              _react2['default'].createElement(
                'div',
                { className: 'panel-body' },
                _react2['default'].createElement(
                  'form',
                  { onSubmit: this.handleSubmit },
                  _react2['default'].createElement(
                    'div',
                    { className: 'form-group ' + this.state.nameValidationState },
                    _react2['default'].createElement(
                      'label',
                      { className: 'control-label' },
                      'Character Name'
                    ),
                    _react2['default'].createElement('input', { type: 'text', className: 'form-control', ref: 'nameTextField', value: this.state.name,
                      onChange: _actionsAddCharacterActions2['default'].updateName, autoFocus: true }),
                    _react2['default'].createElement(
                      'span',
                      { className: 'help-block' },
                      this.state.helpBlock
                    )
                  ),
                  _react2['default'].createElement(
                    'div',
                    { className: 'form-group ' + this.state.genderValidationState },
                    _react2['default'].createElement(
                      'div',
                      { className: 'radio radio-inline' },
                      _react2['default'].createElement('input', { type: 'radio', name: 'gender', id: 'female', value: 'Female', checked: this.state.gender === 'Female',
                        onChange: _actionsAddCharacterActions2['default'].updateGender }),
                      _react2['default'].createElement(
                        'label',
                        { htmlFor: 'female' },
                        'Female'
                      )
                    ),
                    _react2['default'].createElement(
                      'div',
                      { className: 'radio radio-inline' },
                      _react2['default'].createElement('input', { type: 'radio', name: 'gender', id: 'male', value: 'Male', checked: this.state.gender === 'Male',
                        onChange: _actionsAddCharacterActions2['default'].updateGender }),
                      _react2['default'].createElement(
                        'label',
                        { htmlFor: 'male' },
                        'Male'
                      )
                    )
                  ),
                  _react2['default'].createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-primary' },
                    'Submit'
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return AddCharacter;
})(_react2['default'].Component);

exports['default'] = AddCharacter;
module.exports = exports['default'];

},{"../actions/AddCharacterActions":1,"../stores/AddCharacterStore":19,"react":"react"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _Footer = require('./Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _Navbar = require('./Navbar');

var _Navbar2 = _interopRequireDefault(_Navbar);

var App = (function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        _get(Object.getPrototypeOf(App.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                null,
                _react2['default'].createElement(_Navbar2['default'], null),
                _react2['default'].createElement(_reactRouter.RouteHandler, null),
                _react2['default'].createElement(_Footer2['default'], null)
            );
        }
    }]);

    return App;
})(_react2['default'].Component);

exports['default'] = App;
module.exports = exports['default'];

},{"./Footer":13,"./Navbar":15,"react":"react","react-router":"react-router"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storesCharacterStore = require('../stores/CharacterStore');

var _storesCharacterStore2 = _interopRequireDefault(_storesCharacterStore);

var _actionsCharacterActions = require('../actions/CharacterActions');

var _actionsCharacterActions2 = _interopRequireDefault(_actionsCharacterActions);

var Character = (function (_React$Component) {
  _inherits(Character, _React$Component);

  function Character(props) {
    _classCallCheck(this, Character);

    _get(Object.getPrototypeOf(Character.prototype), 'constructor', this).call(this, props);

    this.state = _storesCharacterStore2['default'].getState();
    this.onChange = this.onChange.bind(this);
  }

  _createClass(Character, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _storesCharacterStore2['default'].listen(this.onChange);

      _actionsCharacterActions2['default'].getCharacter(this.props.params.id);

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
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _storesCharacterStore2['default'].unlisten(this.onChange);

      // remove full-page bg image when navigating back
      $(document.body).removeClass();
    }

    // not called for the initial render, only when updated
    // transitioning from char to char means component is never unmounted
    // this is called if we are in this component and URL changes
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      // Fetch new character data when URL path changes
      if (this.props.params.id !== prevProps.params.id) {
        _actionsCharacterActions2['default'].getCharacter(this.props.params.id);
      }

      if (this.state.race !== prevState.race) {
        $(document.body).attr('class', 'profile ' + this.state.race.toLowerCase());
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(state) {
      this.setState(state);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: 'container' },
        _react2['default'].createElement(
          'div',
          { className: 'profile-img' },
          _react2['default'].createElement(
            'a',
            { className: 'magnific-popup', href: 'https://image.eveonline.com/Character/' + this.state.characterId + '_1024.jpg' },
            _react2['default'].createElement('img', { src: 'https://image.eveonline.com/Character/' + this.state.characterId + '_256.jpg' })
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'profile-info clearfix' },
          _react2['default'].createElement(
            'h2',
            null,
            _react2['default'].createElement(
              'strong',
              null,
              this.state.name
            )
          ),
          _react2['default'].createElement(
            'h4',
            { className: 'lead' },
            'Race: ',
            _react2['default'].createElement(
              'strong',
              null,
              this.state.race
            )
          ),
          _react2['default'].createElement(
            'h4',
            { className: 'lead' },
            'Bloodline: ',
            _react2['default'].createElement(
              'strong',
              null,
              this.state.bloodline
            )
          ),
          _react2['default'].createElement(
            'h4',
            { className: 'lead' },
            'Gender: ',
            _react2['default'].createElement(
              'strong',
              null,
              this.state.gender
            )
          ),
          _react2['default'].createElement(
            'button',
            { className: 'btn btn-transparent',
              onClick: _actionsCharacterActions2['default'].report.bind(this, this.state.characterId),
              disabled: this.state.isReported },
            this.state.isReported ? 'Reported' : 'Report Character'
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'profile-stats clearfix' },
          _react2['default'].createElement(
            'ul',
            null,
            _react2['default'].createElement(
              'li',
              null,
              _react2['default'].createElement(
                'span',
                { className: 'stats-number' },
                this.state.winLossRatio
              ),
              'Winning Percentage'
            ),
            _react2['default'].createElement(
              'li',
              null,
              _react2['default'].createElement(
                'span',
                { className: 'stats-number' },
                this.state.wins
              ),
              ' Wins'
            ),
            _react2['default'].createElement(
              'li',
              null,
              _react2['default'].createElement(
                'span',
                { className: 'stats-number' },
                this.state.losses
              ),
              ' Losses'
            )
          )
        )
      );
    }
  }]);

  return Character;
})(_react2['default'].Component);

Character.contextTypes = {
  router: _react2['default'].PropTypes.func.isRequired
};

Character.propTypes = {
  // from react router `characters/:id`
  params: _react2['default'].PropTypes.object.isRequired
};

exports['default'] = Character;
module.exports = exports['default'];

},{"../actions/CharacterActions":2,"../stores/CharacterStore":21,"react":"react"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _underscore = require('underscore');

var _storesCharacterListStore = require('../stores/CharacterListStore');

var _storesCharacterListStore2 = _interopRequireDefault(_storesCharacterListStore);

var _actionsCharacterListActions = require('../actions/CharacterListActions');

var _actionsCharacterListActions2 = _interopRequireDefault(_actionsCharacterListActions);

// /top/:race

var CharacterList = (function (_React$Component) {
  _inherits(CharacterList, _React$Component);

  function CharacterList(props) {
    _classCallCheck(this, CharacterList);

    _get(Object.getPrototypeOf(CharacterList.prototype), 'constructor', this).call(this, props);
    this.state = _storesCharacterListStore2['default'].getState();
    this.onChange = this.onChange.bind(this);
  }

  _createClass(CharacterList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // bind to store
      _storesCharacterListStore2['default'].listen(this.onChange);
      // ajax call
      _actionsCharacterListActions2['default'].getCharacters(this.props.params);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _storesCharacterListStore2['default'].unlisten(this.onChange);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (!(0, _underscore.isEqual)(prevProps.params, this.props.params)) {
        _actionsCharacterListActions2['default'].getCharacters(this.props.params);
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(state) {
      this.setState(state);
    }
  }, {
    key: 'render',
    value: function render() {
      var charactersList = this.state.characters.map(function (character, index) {
        return _react2['default'].createElement(
          'div',
          { key: character.characterId, className: 'list-group-item animated fadeIn' },
          _react2['default'].createElement(
            'div',
            { className: 'media' },
            _react2['default'].createElement(
              'span',
              { className: 'position pull-left' },
              index + 1
            ),
            _react2['default'].createElement(
              'div',
              { className: 'pull-left thumb-lg' },
              _react2['default'].createElement(
                _reactRouter.Link,
                { to: '/characters/' + character.characterId },
                _react2['default'].createElement('img', { className: 'media-object', src: 'http://image.eveonline.com/Character/' + character.characterId + '_128.jpg' })
              )
            ),
            _react2['default'].createElement(
              'div',
              { className: 'media-body' },
              _react2['default'].createElement(
                'h4',
                { className: 'media-heading' },
                _react2['default'].createElement(
                  _reactRouter.Link,
                  { to: '/characters/' + character.characterId },
                  character.name
                )
              ),
              _react2['default'].createElement(
                'small',
                null,
                'Race: ',
                _react2['default'].createElement(
                  'strong',
                  null,
                  character.race
                )
              ),
              _react2['default'].createElement('br', null),
              _react2['default'].createElement(
                'small',
                null,
                'Bloodline: ',
                _react2['default'].createElement(
                  'strong',
                  null,
                  character.bloodline
                )
              ),
              _react2['default'].createElement('br', null),
              _react2['default'].createElement(
                'small',
                null,
                'Wins: ',
                _react2['default'].createElement(
                  'strong',
                  null,
                  character.wins
                ),
                ' Losses: ',
                _react2['default'].createElement(
                  'strong',
                  null,
                  character.losses
                )
              )
            )
          )
        );
      });

      return _react2['default'].createElement(
        'div',
        { className: 'container' },
        _react2['default'].createElement(
          'div',
          { className: 'list-group' },
          charactersList
        )
      );
    }
  }]);

  return CharacterList;
})(_react2['default'].Component);

CharacterList.contextTypes = {
  router: _react2['default'].PropTypes.func.isRequired
};

exports['default'] = CharacterList;
module.exports = exports['default'];

},{"../actions/CharacterListActions":3,"../stores/CharacterListStore":20,"react":"react","react-router":"react-router","underscore":"underscore"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _storesFooterStore = require('../stores/FooterStore');

var _storesFooterStore2 = _interopRequireDefault(_storesFooterStore);

var _actionsFooterActions = require('../actions/FooterActions');

var _actionsFooterActions2 = _interopRequireDefault(_actionsFooterActions);

// Fetches and displays the Top 5 characters.

var Footer = (function (_React$Component) {
  _inherits(Footer, _React$Component);

  function Footer(props) {
    _classCallCheck(this, Footer);

    _get(Object.getPrototypeOf(Footer.prototype), 'constructor', this).call(this, props);
    // set initial state
    this.state = _storesFooterStore2['default'].getState();
    // need to bind this for any internal methods
    this.onChange = this.onChange.bind(this);
  }

  // invoked once on initial render, only on client, has DOM
  // send AJAX requests, register store listeners, integrate with other JS

  _createClass(Footer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // subscribe to the Store, which will callback with store data
      _storesFooterStore2['default'].listen(this.onChange);

      // fire off AJAX request
      _actionsFooterActions2['default'].getTopCharacters();
    }

    // any necessary cleanup, such as invalidating timers or unregistering listeners
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _storesFooterStore2['default'].unlisten(this.onChange);
    }
  }, {
    key: 'onChange',
    value: function onChange(state) {
      this.setState(state);
    }
  }, {
    key: 'render',
    value: function render() {
      // li item with links - dynamic children required to have keys
      var leaderboardCharacters = undefined;
      if (Array.isArray(this.state.characters)) {
        leaderboardCharacters = this.state.characters.map(function (character) {
          return _react2['default'].createElement(
            'li',
            { key: character.characterId },
            _react2['default'].createElement(
              _reactRouter.Link,
              { to: '/characters/' + character.characterId },
              _react2['default'].createElement('img', { className: 'thumb-md', src: 'http://image.eveonline.com/Character/' + character.characterId + '_128.jpg' })
            )
          );
        });
      }

      return _react2['default'].createElement(
        'footer',
        null,
        _react2['default'].createElement(
          'div',
          { className: 'container' },
          _react2['default'].createElement(
            'div',
            { className: 'row' },
            _react2['default'].createElement(
              'div',
              { className: 'col-sm-5' },
              _react2['default'].createElement(
                'h3',
                { className: 'lead' },
                _react2['default'].createElement(
                  'strong',
                  null,
                  'Footer'
                )
              )
            ),
            _react2['default'].createElement(
              'div',
              { className: 'col-sm-7 hidden-xs' },
              _react2['default'].createElement(
                'h3',
                { className: 'lead' },
                _react2['default'].createElement(
                  'strong',
                  null,
                  'Leaderboard'
                ),
                ' Top 5 Characters'
              ),
              _react2['default'].createElement(
                'ul',
                { className: 'list-inline' },
                leaderboardCharacters
              )
            )
          )
        )
      );
    }
  }]);

  return Footer;
})(_react2['default'].Component);

exports['default'] = Footer;
module.exports = exports['default'];
/* Link auto applies 'active' CSS class */

},{"../actions/FooterActions":4,"../stores/FooterStore":22,"react":"react","react-router":"react-router"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _storesHomeStore = require('../stores/HomeStore');

var _storesHomeStore2 = _interopRequireDefault(_storesHomeStore);

var _actionsHomeActions = require('../actions/HomeActions');

var _actionsHomeActions2 = _interopRequireDefault(_actionsHomeActions);

var _underscore = require('underscore');

var Home = (function (_React$Component) {
  _inherits(Home, _React$Component);

  function Home(props) {
    _classCallCheck(this, Home);

    _get(Object.getPrototypeOf(Home.prototype), 'constructor', this).call(this, props);
    this.state = _storesHomeStore2['default'].getState();
    this.onChange = this.onChange.bind(this);
  }

  _createClass(Home, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _storesHomeStore2['default'].listen(this.onChange);

      _actionsHomeActions2['default'].getTwoCharacters();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _storesHomeStore2['default'].unlisten(this.onChange);
    }
  }, {
    key: 'onChange',
    value: function onChange(state) {
      this.setState(state);
    }
  }, {
    key: 'handleClick',
    value: function handleClick(winner) {
      var winnerId = winner.characterId;
      // take current characters, find where matches winner id, subtract winner
      var loserId = (0, _underscore.first)((0, _underscore.without)(this.state.characters, (0, _underscore.findWhere)(this.state.characters, {
        characterId: winnerId
      }))).characterId;

      _actionsHomeActions2['default'].vote(winnerId, loserId);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var characterNodes = this.state.characters.map(function (character, index) {
        return _react2['default'].createElement(
          'div',
          { key: character.characterId, className: index === 0 ? 'col-xs-6 col-sm-6 col-md-5 col-md-offset-1' : 'col-xs-6 col-sm-6 col-md-5' },
          _react2['default'].createElement(
            'div',
            { className: 'thumbnail fadeInUp animated' },
            _react2['default'].createElement('img', { onClick: _this.handleClick.bind(_this, character), src: 'http://image.eveonline.com/Character/' + character.characterId + '_512.jpg' }),
            _react2['default'].createElement(
              'div',
              { className: 'caption text-center' },
              _react2['default'].createElement(
                'ul',
                { className: 'list-inline' },
                _react2['default'].createElement(
                  'li',
                  null,
                  _react2['default'].createElement(
                    'strong',
                    null,
                    'Race:'
                  ),
                  ' ',
                  character.race
                ),
                _react2['default'].createElement(
                  'li',
                  null,
                  _react2['default'].createElement(
                    'strong',
                    null,
                    'Bloodline:'
                  ),
                  ' ',
                  character.bloodline
                )
              ),
              _react2['default'].createElement(
                'h4',
                null,
                _react2['default'].createElement(
                  _reactRouter.Link,
                  { to: '/characters/' + character.characterId },
                  _react2['default'].createElement(
                    'strong',
                    null,
                    character.name
                  )
                )
              )
            )
          )
        );
      });

      return _react2['default'].createElement(
        'div',
        { className: 'container' },
        _react2['default'].createElement(
          'h3',
          { className: 'text-center' },
          'Click on the portrait. Select your favorite.'
        ),
        _react2['default'].createElement(
          'div',
          { className: 'row' },
          characterNodes
        )
      );
    }
  }]);

  return Home;
})(_react2['default'].Component);

exports['default'] = Home;
module.exports = exports['default'];

},{"../actions/HomeActions":5,"../stores/HomeStore":23,"react":"react","react-router":"react-router","underscore":"underscore"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _storesNavbarStore = require('../stores/NavbarStore');

var _storesNavbarStore2 = _interopRequireDefault(_storesNavbarStore);

var _actionsNavbarActions = require('../actions/NavbarActions');

var _actionsNavbarActions2 = _interopRequireDefault(_actionsNavbarActions);

// Initiates socket.io connection to display active listeners
// Home, Browse, Stats, Top 100

var Navbar = (function (_React$Component) {
  _inherits(Navbar, _React$Component);

  function Navbar(props) {
    _classCallCheck(this, Navbar);

    _get(Object.getPrototypeOf(Navbar.prototype), 'constructor', this).call(this, props);
    // set initial state
    this.state = _storesNavbarStore2['default'].getState();
    // need to bind this for any internal methods
    this.onChange = this.onChange.bind(this);
  }

  // necessary for referencing  an instance of the router, which in turn gives us access to current path, current query parameters, route parameters and transitions to other routes
  // pass as argument to Navbar actions so that it can navigate to character profile pages after fetching data

  _createClass(Navbar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // subscribe to the Store, which will callback with store data
      _storesNavbarStore2['default'].listen(this.onChange);
      _actionsNavbarActions2['default'].getCharacterCount();

      this.connectSocket();
    }
  }, {
    key: 'connectSocket',
    value: function connectSocket() {
      var socket = io.connect();

      socket.on('onlineUsers', function (data) {
        _actionsNavbarActions2['default'].updateOnlineUsers(data);
      });

      $(document).ajaxStart(function () {
        // called when first ajax req begins
        _actionsNavbarActions2['default'].updateAjaxAnimation('fadeIn');
      });

      $(document).ajaxComplete(function () {
        setTimeout(function () {
          _actionsNavbarActions2['default'].updateAjaxAnimation('fadeOut');
        }, 750);
      });
    }

    // search for characters
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      event.preventDefault();
      var searchQuery = this.state.searchQuery.trim();
      if (searchQuery) {
        _actionsNavbarActions2['default'].findCharacter({
          searchQuery: searchQuery,
          // pass a ref to the DOM node to render shaking animation if not found
          searchForm: this.refs.searchForm.getDOMNode(),
          router: this.context.router
        });
      }
    }

    // any necessary cleanup, such as invalidating timers or unregistering listeners
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _storesNavbarStore2['default'].unlisten(this.onChange);
    }
  }, {
    key: 'onChange',
    value: function onChange(state) {
      this.setState(state);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'nav',
        { className: 'navbar navbar-default navbar-static-top' },
        _react2['default'].createElement(
          'div',
          { className: 'navbar-header' },
          _react2['default'].createElement(
            'button',
            { type: 'button', className: 'navbar-toggle collapsed', 'data-toggle': 'collapse', 'data-target': '#navbar' },
            _react2['default'].createElement(
              'span',
              { className: 'sr-only' },
              'Toggle navigation'
            ),
            _react2['default'].createElement('span', { className: 'icon-bar' }),
            _react2['default'].createElement('span', { className: 'icon-bar' }),
            _react2['default'].createElement('span', { className: 'icon-bar' })
          ),
          _react2['default'].createElement(
            _reactRouter.Link,
            { to: '/', className: 'navbar-brand' },
            _react2['default'].createElement(
              'span',
              { ref: 'triangles', className: 'triangles animated ' + this.state.ajaxAnimationClass },
              _react2['default'].createElement('div', { className: 'tri invert' }),
              _react2['default'].createElement('div', { className: 'tri invert' }),
              _react2['default'].createElement('div', { className: 'tri' }),
              _react2['default'].createElement('div', { className: 'tri invert' }),
              _react2['default'].createElement('div', { className: 'tri invert' }),
              _react2['default'].createElement('div', { className: 'tri' }),
              _react2['default'].createElement('div', { className: 'tri invert' }),
              _react2['default'].createElement('div', { className: 'tri' }),
              _react2['default'].createElement('div', { className: 'tri invert' })
            ),
            'NEF',
            _react2['default'].createElement(
              'span',
              { className: 'badge badge-up badge-danger' },
              this.state.onlineUsers
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { id: 'navbar', className: 'navbar-collapse collapse' },
          _react2['default'].createElement(
            'form',
            { ref: 'searchForm', className: 'navbar-form navbar-left animated', onSubmit: this.handleSubmit.bind(this) },
            _react2['default'].createElement(
              'div',
              { className: 'input-group' },
              _react2['default'].createElement('input', { type: 'text', className: 'form-control', placeholder: this.state.totalCharacters + ' characters', value: this.state.searchQuery, onChange: _actionsNavbarActions2['default'].updateSearchQuery }),
              _react2['default'].createElement(
                'span',
                { className: 'input-group-btn' },
                _react2['default'].createElement(
                  'button',
                  { className: 'btn btn-default', onClick: this.handleSubmit.bind(this) },
                  _react2['default'].createElement('span', { className: 'glyphicon glyphicon-search' })
                )
              )
            )
          ),
          _react2['default'].createElement(
            'ul',
            { className: 'nav navbar-nav' },
            _react2['default'].createElement(
              'li',
              null,
              _react2['default'].createElement(
                _reactRouter.Link,
                { to: '/' },
                'Home'
              )
            ),
            _react2['default'].createElement(
              'li',
              null,
              _react2['default'].createElement(
                _reactRouter.Link,
                { to: '/stats' },
                'Stats'
              )
            ),
            _react2['default'].createElement(
              'li',
              { className: 'dropdown' },
              _react2['default'].createElement(
                'a',
                { href: '#', className: 'dropdown-toggle', 'data-toggle': 'dropdown' },
                'Top 100 ',
                _react2['default'].createElement('span', { className: 'caret' })
              ),
              _react2['default'].createElement(
                'ul',
                { className: 'dropdown-menu' },
                _react2['default'].createElement(
                  'li',
                  null,
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/top' },
                    'Top Overall'
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/top/caldari' },
                    'Caldari'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/caldari/achura' },
                        'Achura'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/caldari/civire' },
                        'Civire'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/caldari/deteis' },
                        'Deteis'
                      )
                    )
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/top/gallente' },
                    'Gallente'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/gallente/gallente' },
                        'Gallente'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/gallente/intaki' },
                        'Intaki'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/gallente/jin-mei' },
                        'Jin-Mei'
                      )
                    )
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/top/minmatar' },
                    'Minmatar'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/minmatar/brutor' },
                        'Brutor'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/minmatar/sebiestor' },
                        'Sebiestor'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/minmatar/vherokior' },
                        'Vherokior'
                      )
                    )
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/top/amarr' },
                    'Amarr'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/amarr/amarr' },
                        'Amarr'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/amarr/ni-kunni' },
                        'Ni-Kunni'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/top/amarr/khanid' },
                        'Khanid'
                      )
                    )
                  )
                ),
                _react2['default'].createElement('li', { className: 'divider' }),
                _react2['default'].createElement(
                  'li',
                  null,
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/shame' },
                    'Hall of Shame'
                  )
                )
              )
            ),
            _react2['default'].createElement(
              'li',
              { className: 'dropdown' },
              _react2['default'].createElement(
                'a',
                { href: '#', className: 'dropdown-toggle', 'data-toggle': 'dropdown' },
                'Female ',
                _react2['default'].createElement('span', { className: 'caret' })
              ),
              _react2['default'].createElement(
                'ul',
                { className: 'dropdown-menu' },
                _react2['default'].createElement(
                  'li',
                  null,
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/female' },
                    'All'
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/female/caldari' },
                    'Caldari'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/caldari/achura' },
                        'Achura'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/caldari/civire' },
                        'Civire'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/caldari/deteis' },
                        'Deteis'
                      )
                    )
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/female/gallente' },
                    'Gallente'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/gallente/gallente' },
                        'Gallente'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/gallente/intaki' },
                        'Intaki'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/gallente/jin-mei' },
                        'Jin-Mei'
                      )
                    )
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/female/minmatar' },
                    'Minmatar'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/minmatar/brutor' },
                        'Brutor'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/minmatar/sebiestor' },
                        'Sebiestor'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/minmatar/vherokior' },
                        'Vherokior'
                      )
                    )
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/female/amarr' },
                    'Amarr'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/amarr/amarr' },
                        'Amarr'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/amarr/ni-kunni' },
                        'Ni-Kunni'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/female/amarr/khanid' },
                        'Khanid'
                      )
                    )
                  )
                )
              )
            ),
            _react2['default'].createElement(
              'li',
              { className: 'dropdown' },
              _react2['default'].createElement(
                'a',
                { href: '#', className: 'dropdown-toggle', 'data-toggle': 'dropdown' },
                'Male ',
                _react2['default'].createElement('span', { className: 'caret' })
              ),
              _react2['default'].createElement(
                'ul',
                { className: 'dropdown-menu' },
                _react2['default'].createElement(
                  'li',
                  null,
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/male' },
                    'All'
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/male/caldari' },
                    'Caldari'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/caldari/achura' },
                        'Achura'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/caldari/civire' },
                        'Civire'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/caldari/deteis' },
                        'Deteis'
                      )
                    )
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/male/gallente' },
                    'Gallente'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/gallente/gallente' },
                        'Gallente'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/gallente/intaki' },
                        'Intaki'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/gallente/jin-mei' },
                        'Jin-Mei'
                      )
                    )
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/male/minmatar' },
                    'Minmatar'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/minmatar/brutor' },
                        'Brutor'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/minmatar/sebiestor' },
                        'Sebiestor'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/minmatar/vherokior' },
                        'Vherokior'
                      )
                    )
                  )
                ),
                _react2['default'].createElement(
                  'li',
                  { className: 'dropdown-submenu' },
                  _react2['default'].createElement(
                    _reactRouter.Link,
                    { to: '/male/amarr' },
                    'Amarr'
                  ),
                  _react2['default'].createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/amarr/amarr' },
                        'Amarr'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/amarr/ni-kunni' },
                        'Ni-Kunni'
                      )
                    ),
                    _react2['default'].createElement(
                      'li',
                      null,
                      _react2['default'].createElement(
                        _reactRouter.Link,
                        { to: '/male/amarr/khanid' },
                        'Khanid'
                      )
                    )
                  )
                )
              )
            ),
            _react2['default'].createElement(
              'li',
              null,
              _react2['default'].createElement(
                _reactRouter.Link,
                { to: '/add' },
                'Add'
              )
            )
          )
        )
      );
    }
  }]);

  return Navbar;
})(_react2['default'].Component);

Navbar.contextTypes = {
  router: _react2['default'].PropTypes.func.isRequired
};

exports['default'] = Navbar;
module.exports = exports['default'];

},{"../actions/NavbarActions":6,"../stores/NavbarStore":24,"react":"react","react-router":"react-router"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storesStatsStore = require('../stores/StatsStore');

var _storesStatsStore2 = _interopRequireDefault(_storesStatsStore);

var _actionsStatsActions = require('../actions/StatsActions');

var _actionsStatsActions2 = _interopRequireDefault(_actionsStatsActions);

var Stats = (function (_React$Component) {
  _inherits(Stats, _React$Component);

  function Stats(props) {
    _classCallCheck(this, Stats);

    _get(Object.getPrototypeOf(Stats.prototype), 'constructor', this).call(this, props);
    this.state = _storesStatsStore2['default'].getState();
    this.onChange = this.onChange.bind(this);
  }

  _createClass(Stats, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _storesStatsStore2['default'].listen(this.onChange);

      _actionsStatsActions2['default'].getStats();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _storesStatsStore2['default'].unlisten(this.onChange);
    }
  }, {
    key: 'onChange',
    value: function onChange(state) {
      this.setState(state);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: 'container' },
        _react2['default'].createElement(
          'div',
          { className: 'panel panel-default' },
          _react2['default'].createElement(
            'table',
            { className: 'table table-striped' },
            _react2['default'].createElement(
              'thead',
              null,
              _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                  'th',
                  { colSpan: '2' },
                  'Stats'
                )
              )
            ),
            _react2['default'].createElement(
              'tbody',
              null,
              _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                  'td',
                  null,
                  'Leading race in Top 100'
                ),
                _react2['default'].createElement(
                  'td',
                  null,
                  this.state.leadingRace.race,
                  ' with ',
                  this.state.leadingRace.count,
                  ' characters'
                )
              ),
              _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                  'td',
                  null,
                  'Leading bloodline in Top 100'
                ),
                _react2['default'].createElement(
                  'td',
                  null,
                  this.state.leadingBloodline.bloodline,
                  ' with ',
                  this.state.leadingBloodline.count,
                  ' characters'
                )
              ),
              _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                  'td',
                  null,
                  'Amarr Characters'
                ),
                _react2['default'].createElement(
                  'td',
                  null,
                  this.state.amarrCount
                )
              ),
              _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                  'td',
                  null,
                  'Caldari Characters'
                ),
                _react2['default'].createElement(
                  'td',
                  null,
                  this.state.caldariCount
                )
              ),
              _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                  'td',
                  null,
                  'Gallente Characters'
                ),
                _react2['default'].createElement(
                  'td',
                  null,
                  this.state.gallenteCount
                )
              ),
              _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                  'td',
                  null,
                  'Minmatar Characters'
                ),
                _react2['default'].createElement(
                  'td',
                  null,
                  this.state.minmatarCount
                )
              ),
              _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                  'td',
                  null,
                  'Total votes cast'
                ),
                _react2['default'].createElement(
                  'td',
                  null,
                  this.state.totalVotes
                )
              ),
              _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                  'td',
                  null,
                  'Female characters'
                ),
                _react2['default'].createElement(
                  'td',
                  null,
                  this.state.femaleCount
                )
              ),
              _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                  'td',
                  null,
                  'Male characters'
                ),
                _react2['default'].createElement(
                  'td',
                  null,
                  this.state.maleCount
                )
              ),
              _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                  'td',
                  null,
                  'Total number of characters'
                ),
                _react2['default'].createElement(
                  'td',
                  null,
                  this.state.totalCount
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Stats;
})(_react2['default'].Component);

exports['default'] = Stats;
module.exports = exports['default'];

},{"../actions/StatsActions":7,"../stores/StatsStore":25,"react":"react"}],17:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRouter2 = _interopRequireDefault(_reactRouter);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

// Client entry point for app
// React Router bootstraps the routes from routes.js file, matches them against a URL, and then executes the appropriate callback handler
// If on "/" path, then render Home as defined in `routes.js`
_reactRouter2['default'].run(_routes2['default'], _reactRouter2['default'].HistoryLocation, function (Handler) {
    _react2['default'].render(_react2['default'].createElement(Handler, null), document.getElementById('app'));
});

},{"./routes":18,"react":"react","react-router":"react-router"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _componentsApp = require('./components/App');

var _componentsApp2 = _interopRequireDefault(_componentsApp);

var _componentsHome = require('./components/Home');

var _componentsHome2 = _interopRequireDefault(_componentsHome);

var _componentsAddCharacter = require('./components/AddCharacter');

var _componentsAddCharacter2 = _interopRequireDefault(_componentsAddCharacter);

var _componentsStats = require('./components/Stats');

var _componentsStats2 = _interopRequireDefault(_componentsStats);

var _componentsCharacter = require('./components/Character');

var _componentsCharacter2 = _interopRequireDefault(_componentsCharacter);

var _componentsCharacterList = require('./components/CharacterList');

var _componentsCharacterList2 = _interopRequireDefault(_componentsCharacterList);

exports['default'] = _react2['default'].createElement(
    _reactRouter.Route,
    { handler: _componentsApp2['default'] },
    _react2['default'].createElement(_reactRouter.DefaultRoute, { name: 'home', handler: _componentsHome2['default'] }),
    _react2['default'].createElement(_reactRouter.Route, { name: 'add', path: 'add', handler: _componentsAddCharacter2['default'] }),
    _react2['default'].createElement(_reactRouter.Route, { name: 'characterDetail', path: '/characters/:id', handler: _componentsCharacter2['default'] }),
    _react2['default'].createElement(_reactRouter.Route, { name: 'stats', path: '/stats', handler: _componentsStats2['default'] }),
    _react2['default'].createElement(
        _reactRouter.Route,
        { name: 'characterList', path: ':category', handler: _componentsCharacterList2['default'] },
        _react2['default'].createElement(
            _reactRouter.Route,
            { path: ':race', handler: _componentsCharacterList2['default'] },
            _react2['default'].createElement(_reactRouter.Route, { path: ':bloodline', handler: _componentsCharacterList2['default'] })
        )
    )
);
module.exports = exports['default'];
/** needs to be last - handles /shame, /top, /top/race/bloodline **/

},{"./components/AddCharacter":9,"./components/App":10,"./components/Character":11,"./components/CharacterList":12,"./components/Home":14,"./components/Stats":16,"react":"react","react-router":"react-router"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _actionsAddCharacterActions = require('../actions/AddCharacterActions');

var _actionsAddCharacterActions2 = _interopRequireDefault(_actionsAddCharacterActions);

var AddCharacterStore = (function () {
    _createClass(AddCharacterStore, null, [{
        key: 'ERROR_CLASS',
        get: function get() {
            return 'has-success';
        }
    }, {
        key: 'SUCCESS_CLASS',
        get: function get() {
            return 'has-error';
        }
    }]);

    function AddCharacterStore() {
        _classCallCheck(this, AddCharacterStore);

        this.bindActions(_actionsAddCharacterActions2['default']);

        this.name = '';
        this.gender = '';
        this.helpBlock = '';
        this.nameValidationState = '';
        this.genderValidationState = '';
        this.helpBlock = '';
    }

    _createClass(AddCharacterStore, [{
        key: 'onAddCharacterSuccess',
        value: function onAddCharacterSuccess(successMessage) {
            // [ name, gender ]
            this.nameValidationState = AddCharacterStore.SUCCESS_CLASS;
            this.helpBlock = successMessage;
        }
    }, {
        key: 'onAddCharacterFail',
        value: function onAddCharacterFail(errorMessage) {
            // if name not in database
            this.nameValidationState = AddCharacterStore.ERROR_CLASS;
            this.helpBlock = errorMessage;
        }
    }, {
        key: 'onUpdateName',
        value: function onUpdateName(event) {
            // onChange => event to updateName
            this.name = event.target.value;
            this.nameValidationState = '';
            this.helpBlock = '';
        }
    }, {
        key: 'onUpdateGender',
        value: function onUpdateGender(event) {
            this.gender = event.target.value;
            this.genderValidationState = '';
        }
    }, {
        key: 'onInvalidName',
        value: function onInvalidName() {
            // if name is empty
            this.nameValidationState = AddCharacterStore.ERROR_CLASS;
            this.helpBlock = 'Please enter a character name.';
        }
    }, {
        key: 'onInvalidGender',
        value: function onInvalidGender() {
            this.genderValidationState = AddCharacterStore.ERROR_CLASS;
        }
    }]);

    return AddCharacterStore;
})();

exports['default'] = _alt2['default'].createStore(AddCharacterStore);
module.exports = exports['default'];

},{"../actions/AddCharacterActions":1,"../alt":8}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _actionsCharacterListActions = require('../actions/CharacterListActions');

var _actionsCharacterListActions2 = _interopRequireDefault(_actionsCharacterListActions);

var CharacterListStore = (function () {
  function CharacterListStore() {
    _classCallCheck(this, CharacterListStore);

    this.bindActions(_actionsCharacterListActions2['default']);
    this.characters = [];
  }

  _createClass(CharacterListStore, [{
    key: 'onGetCharactersSuccess',
    value: function onGetCharactersSuccess(data) {
      this.characters = data;
    }
  }, {
    key: 'onGetCharactersFail',
    value: function onGetCharactersFail(jqXhr) {
      toastr.error(jqXhr.responseJSON.message);
    }
  }]);

  return CharacterListStore;
})();

exports['default'] = _alt2['default'].createStore(CharacterListStore);
module.exports = exports['default'];

},{"../actions/CharacterListActions":3,"../alt":8}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscore = require('underscore');

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _actionsCharacterActions = require('../actions/CharacterActions');

var _actionsCharacterActions2 = _interopRequireDefault(_actionsCharacterActions);

var CharacterStore = (function () {
    function CharacterStore() {
        _classCallCheck(this, CharacterStore);

        this.bindActions(_actionsCharacterActions2['default']);

        this.characterId = '';
        this.isReported = false;
        this.name = 'TBD';
        this.race = 'TBD';
        this.bloodline = 'TBD';
        this.gender = 'TBD';
        this.winLossRatio = 0;
        this.wins = 0;
        this.losses = 0;
    }

    _createClass(CharacterStore, [{
        key: 'onGetCharacterSuccess',
        value: function onGetCharacterSuccess(data) {
            (0, _underscore.assign)(this, data); // merge in character properties

            // block user from reporting a character twice
            var reports = this._getLocalReports();
            this.isReported = (0, _underscore.contains)(reports, this.characterId);
            // If is NaN (from division by zero) then set it to "0"
            this.winLossRatio = (this.wins / (this.wins + this.losses) * 100 || 0).toFixed(1);
        }
    }, {
        key: 'onGetCharacterFail',
        value: function onGetCharacterFail(jqXhr) {
            toastr.error(jqXhr.responseJSON.message);
        }
    }, {
        key: 'onReportSuccess',
        value: function onReportSuccess() {
            this.isReported = true;
            var reports = this._getLocalReports();
            reports.push(this.characterId);
            this._setLocalReports({ reports: reports });

            toastr.warning('Character has been reported.');
        }
    }, {
        key: 'onReportFail',
        value: function onReportFail(jqXhr) {
            toastr.error(jqXhr.responseJSON.message);
        }
    }, {
        key: '_getLocalReports',
        value: function _getLocalReports() {
            var localData = localStorage.getItem('NEF') ? JSON.parse(localStorage.getItem('NEF')) : {};
            localData.reports = localData.reports || [];
            return localData.reports;
        }
    }, {
        key: '_setLocalReports',
        value: function _setLocalReports(data) {
            localStorage.setItem('NEF', JSON.stringify(data));
        }
    }]);

    return CharacterStore;
})();

exports['default'] = _alt2['default'].createStore(CharacterStore);
module.exports = exports['default'];

},{"../actions/CharacterActions":2,"../alt":8,"underscore":"underscore"}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _actionsFooterActions = require('../actions/FooterActions');

var _actionsFooterActions2 = _interopRequireDefault(_actionsFooterActions);

var FooterStore = (function () {
    function FooterStore() {
        _classCallCheck(this, FooterStore);

        // register callbacks with the Alt dispatcher
        // bind all the actions inside FooterActions, auto-handling with onActionName
        // alternative - this.bindListeners({ callback: action })
        this.bindActions(_actionsFooterActions2['default']);

        // initial state
        // all instance variables will become state
        this.characters = [];
    }

    _createClass(FooterStore, [{
        key: 'onGetTopCharactersSuccess',
        value: function onGetTopCharactersSuccess(data) {
            this.characters = data.slice(0, 5);
        }
    }, {
        key: 'onGetTopCharactersFail',
        value: function onGetTopCharactersFail(jqXhr) {
            // Handle multiple response formats, fallback to HTTP status code number.
            toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
        }
    }]);

    return FooterStore;
})();

exports['default'] = _alt2['default'].createStore(FooterStore);
module.exports = exports['default'];

},{"../actions/FooterActions":4,"../alt":8}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _actionsHomeActions = require('../actions/HomeActions');

var _actionsHomeActions2 = _interopRequireDefault(_actionsHomeActions);

var HomeStore = (function () {
    function HomeStore() {
        _classCallCheck(this, HomeStore);

        this.bindActions(_actionsHomeActions2['default']);

        this.characters = [];
    }

    _createClass(HomeStore, [{
        key: 'onGetTwoCharactersSuccess',
        value: function onGetTwoCharactersSuccess(data) {
            this.characters = data;
        }
    }, {
        key: 'onGetTwoCharactersFail',
        value: function onGetTwoCharactersFail(errorMessage) {
            toastr.error(errorMessage);
        }
    }, {
        key: 'onVoteFail',
        value: function onVoteFail(errorMessage) {
            toastr.error(errorMessage);
        }
    }]);

    return HomeStore;
})();

exports['default'] = _alt2['default'].createStore(HomeStore);
module.exports = exports['default'];

},{"../actions/HomeActions":5,"../alt":8}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _actionsNavbarActions = require('../actions/NavbarActions');

var _actionsNavbarActions2 = _interopRequireDefault(_actionsNavbarActions);

var NavbarStore = (function () {
    function NavbarStore() {
        _classCallCheck(this, NavbarStore);

        this.bindActions(_actionsNavbarActions2['default']);
        this.totalCharacters = 0;
        this.onlineUsers = 0;
        this.searchQuery = '';
        this.ajaxAnimationClass = '';
    }

    _createClass(NavbarStore, [{
        key: 'onUpdateSearchQuery',
        value: function onUpdateSearchQuery(event) {
            this.searchQuery = event.target.value;
        }
    }, {
        key: 'onFindCharacterSuccess',
        value: function onFindCharacterSuccess(payload) {
            console.log("found character", payload.character);
            var url = '/characters/' + payload.character.characterId;
            payload.router.transitionTo(url);
        }
    }, {
        key: 'onFindCharacterFail',
        value: function onFindCharacterFail(payload) {
            payload.searchForm.classList.add('shake');
            setTimeout(function () {
                payload.searchForm.classList.remove('shake');
            }, 1000);
        }
    }, {
        key: 'onUpdateOnlineUsers',
        value: function onUpdateOnlineUsers(data) {
            this.onlineUsers = data.onlineUsers;
        }
    }, {
        key: 'onUpdateAjaxAnimation',
        value: function onUpdateAjaxAnimation(className) {
            this.ajaxAnimationClass = className; //fadeIn or fadeOut
        }
    }, {
        key: 'onGetCharacterCountSuccess',
        value: function onGetCharacterCountSuccess(count) {
            this.totalCharacters = count;
        }
    }, {
        key: 'onGetCharacterCountFail',
        value: function onGetCharacterCountFail(jqXhr) {
            toastr.error(jqXhr.responseJSON.message);
        }
    }]);

    return NavbarStore;
})();

exports['default'] = _alt2['default'].createStore(NavbarStore);
module.exports = exports['default'];

},{"../actions/NavbarActions":6,"../alt":8}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _underscore = require('underscore');

var _actionsStatsActions = require('../actions/StatsActions');

var _actionsStatsActions2 = _interopRequireDefault(_actionsStatsActions);

var StatsStore = (function () {
    function StatsStore() {
        _classCallCheck(this, StatsStore);

        this.bindActions(_actionsStatsActions2['default']);

        this.leadingRace = { race: 'Unknown', count: 0 };
        this.leadingBloodline = { bloodline: 'Unknown', count: 0 };
        this.amarrCount = 0;
        this.caldariCount = 0;
        this.gallenteCount = 0;
        this.minmatarCount = 0;
        this.totalVotes = 0;
        this.femaleCount = 0;
        this.maleCount = 0;
        this.totalCount = 0;
    }

    _createClass(StatsStore, [{
        key: 'onGetStatsSuccess',
        value: function onGetStatsSuccess(data) {
            (0, _underscore.assign)(this, data);
        }
    }, {
        key: 'onGetStatsFail',
        value: function onGetStatsFail(jqXhr) {
            toastr.error(jqXhr.responseJSON.message);
        }
    }]);

    return StatsStore;
})();

exports['default'] = _alt2['default'].createStore(StatsStore);
module.exports = exports['default'];

},{"../actions/StatsActions":7,"../alt":8,"underscore":"underscore"}]},{},[17]);
