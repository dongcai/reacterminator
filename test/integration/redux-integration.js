/* eslint-env mocha */
const fs = require('fs')
const shell = require('shelljs')
const assert = require('chai').assert
const reacterminator = require('../../lib/index')

describe.only('redux-integration', function () {
  beforeEach(function () {
    shell.exec('rm -rf ./reacterminator')
  })

  it('should hook redux into component and generate redux files', function () {
    reacterminator(
      {
        type: 'path',
        content: './examples/test/redux-example.html'
      },
      {
        fileToComponent: true,
        generateFiles: true
      }
    )

    // Assert component content
    assert.deepEqual(
      fs.readFileSync('./reacterminator/readonly-components/ReduxExample.jsx', 'utf8'),
      `\
import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import action from '../action-creators/readonly-index';

class ReduxExample extends React.Component {
  render() {
    return (
      <div>
        <form id="email-form" name="email-form" onSubmit={this.props['action.reduxExample.submitEmailForm']}>
          <input id="name"
            name="name"
            value={this.props['state.reduxExample.name']}
            onChange={this.props['action.reduxExample.changeName']} />
          <input id="phone-number"
            type="text"
            name="phone-number-login"
            value={this.props['state.reduxExample.phoneNumber']}
            onChange={this.props['action.reduxExample.changePhoneNumber']} />
          <button id="single-button" onClick={this.props['action.reduxExample.clickSingleButton']}>
          </button>
        </form>
      </div>
      );
  }
}
;
const ReduxExampleWithRedux = reduxConnect(
  (state) => ({
    'state.reduxExample.name': state.reduxExample.name,
    'state.reduxExample.phoneNumber': state.reduxExample.phoneNumber
  }),
  {
    'action.reduxExample.submitEmailForm': action.reduxExample.submitEmailForm,
    'action.reduxExample.changeName': action.reduxExample.changeName,
    'action.reduxExample.changePhoneNumber': action.reduxExample.changePhoneNumber,
    'action.reduxExample.clickSingleButton': action.reduxExample.clickSingleButton
  }
)(ReduxExample);

export default ReduxExampleWithRedux;
`
    )

    // assert store content

    assert.deepEqual(
      fs.readFileSync('./reacterminator/store.js', 'utf8'),
      `\
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/index';

export default createStore(reducers, applyMiddleware(thunk));
`
    )

    // assert action-type-constants content
    assert.deepEqual(
      fs.readFileSync('./reacterminator/action-type-constants/redux-example/change-name.js', 'utf8'),
      `\
export default 'REDUX_EXAMPLE_CHANGE_NAME';
`
    )

    // assert action-type-constants redux-example readonly-index
    assert.deepEqual(
      fs.readFileSync('./reacterminator/action-type-constants/redux-example/readonly-index.js', 'utf8'),
      `\
import changeName from './change-name';
import changePhoneNumber from './change-phone-number';
import clickSingleButton from './click-single-button';
import submitEmailForm from './submit-email-form';

export default {
changeName,
changePhoneNumber,
clickSingleButton,
submitEmailForm
}
`
    )

    // assert action-type-constants readonly-index
    assert.deepEqual(
      fs.readFileSync('./reacterminator/action-type-constants/readonly-index.js', 'utf8'),
      `\
import reduxExample from './redux-example/readonly-index';

export default {
reduxExample
}
`
    )

    // assert action-creators content
    assert.deepEqual(
    fs.readFileSync('./reacterminator/action-creators/redux-example/change-name.js', 'utf8'),
    `\
import actionTypeConstants from '../../action-type-constants/readonly-index';

export default function changeName(event) {
  event.preventDefault();
  return {
    type: actionTypeConstants.reduxExample.changeName,
    value: event.target.value
  };
}
`
    )

    // assert reducers content
    assert.deepEqual(
      fs.readFileSync('./reacterminator/reducers/redux-example/name.js', 'utf8'),
      `\
import actionTypeConstants from '../../action-type-constants/readonly-index';

export default function name(state = '', action) {
  switch () {
    case actionTypeConstants.reduxExample.changeName:
      return action.value;
    default:
      return state;
  }
}
`
    )

    assert.deepEqual(
      fs.readFileSync('./reacterminator/reducers/redux-example/email-form.js', 'utf8'),
      `\
import actionTypeConstants from '../../action-type-constants/readonly-index';

export default function emailForm(state = '', action) {
  switch () {
    case actionTypeConstants.reduxExample.submitEmailForm:
      return '';
    default:
      return state;
  }
}
`
    )

    assert.deepEqual(
      fs.readFileSync('./reacterminator/reducers/redux-example/single-button.js', 'utf8'),
      `\
import actionTypeConstants from '../../action-type-constants/readonly-index';

export default function singleButton(state = '', action) {
  switch () {
    case actionTypeConstants.reduxExample.clickSingleButton:
      return '';
    default:
      return state;
  }
}
`
    )

    // assert reducers redux-example readonly-index
    assert.deepEqual(
      fs.readFileSync('./reacterminator/reducers/redux-example/readonly-index.js', 'utf8'),
      `\
import { combineReducers } from 'redux';
import emailForm from './email-form';
import name from './name';
import phoneNumber from './phone-number';
import singleButton from './single-button';

export default combineReducers({
emailForm,
name,
phoneNumber,
singleButton
})
`
    )

    // assert reducers readonly-index
    assert.deepEqual(
      fs.readFileSync('./reacterminator/reducers/readonly-index.js', 'utf8'),
      `\
import { combineReducers } from 'redux';
import reduxExample from './redux-example/readonly-index';

export default combineReducers({
reduxExample
})
`
    )
  })
})