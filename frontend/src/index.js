const BASE_URL = "http://localhost:3000"
let currentToken = ""
const HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": currentToken
}

document.addEventListener("DOMContentLoaded", () => {
  setUpSignUpAndLogInButtons()
  setUpSignUpAndLoginForms()
  setUpLogOutButton()
})

function setUpSignUpAndLogInButtons() {
  setUpSignUpButton()
  setUpLoginButton()
}

function setUpSignUpButton() {
  document.getElementById("signup-btn").addEventListener("click", () => {
    document.getElementById("login-div").classList.add("hidden")
    document.getElementById("signup-div").classList.remove("hidden")
  })
}

function setUpLoginButton() {
  document.getElementById("login-btn").addEventListener("click", () => {
    document.getElementById("signup-div").classList.add("hidden")
    document.getElementById("login-div").classList.remove("hidden")
  })
}

function setUpSignUpAndLoginForms() {
  setUpSignUpForm()
  setUpLoginForm()
}

function setUpSignUpForm() {
  document.getElementById("signup-form").addEventListener("submit", e => {
    e.preventDefault()
    signupInfo = {
      "email": e.target.querySelector("#user_email").value,
      // "username": e.target.querySelector("#user_username").value,
      "password": e.target.querySelector("#user_password").value,
      "password_confirmation": e.target.querySelector("#user_password_confirmation").value
    }
    fetchPoster(BASE_URL + "/users", signupInfo)
      .then(processLogin)
    e.target.reset()
  }, false)
}

function setUpLoginForm() {
  document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault()
    loginInfo = {
      user: {
        "email": e.target.querySelector('[name="user[email]"').value,
        "password": e.target.querySelector('[name="user[password]"').value
      }
    }

    fetchPoster(BASE_URL + "/users/sign_in", loginInfo)
      .then(processLogin)
    e.target.reset()
  }, false)
}

async function fetchPoster(url, body, token = false) {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  if (token) {
    headers['Authorization'] = currentToken
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
  setToken.call(resp)
  return await resp.json()
}

function setToken() {
  currentToken = this.headers.get('Authorization') || currentToken
}


function processLogin(json) {
  if (json.data) {
    //generate welcome text
    document.getElementById("welcome-text").textContent = `Welcome, ${json.data.attributes.email}!`


    //show new character button
    setUpNewCharacterButton()
    //prepare list of user's characters
    setUpCharacterList(json.included)
    //remove buttons and forms for when a user is logged out, display correct buttons and forms for when a user logs in
    switchDisplayElements()
  } else {
    console.log(json)
  }
}

function switchDisplayElements() {
  switchLoggedOutElements()
  switchLoggedInElements()
}

function switchLoggedOutElements() {
  const buttonsClassList = document.getElementById("new-session-btns").classList
  if (buttonsClassList.contains("hidden")) {
    buttonsClassList.remove("hidden")
    document.getElementById('login-message').classList.remove('hidden')
  } else {
    buttonsClassList.add("hidden")
    document.getElementById("signup-div").classList.add("hidden")
    document.getElementById("login-div").classList.add("hidden")
    document.getElementById('login-message').classList.add('hidden')
  }
}

function switchLoggedInElements() {
  const loggedInClassList = document.getElementById('logged-in-span').classList
  if (loggedInClassList.contains("hidden")) {
    loggedInClassList.remove("hidden")
    document.getElementById("character-menu").classList.remove("hidden")
  } else {
    loggedInClassList.add("hidden")
    document.getElementById("character-menu").classList.add("hidden")
    document.getElementById("new-character-span").classList.add("hidden")
  }
}

function setUpNewCharacterButton() {
  document.getElementById("new-character-btn").addEventListener("click", () => {
    document.getElementById("new-character-form").addEventListener("submit", e => {
      e.preventDefault()
      newCharInfo = {
        character: {
          name: e.target.querySelector("#character_name").value
        }
      }
      fetchPoster(BASE_URL + "/characters", newCharInfo, true)
        .then(processNewCharacter)
      document.getElementById("new-character-span").classList.add("hidden")
      e.target.reset()
    }, false)
    document.getElementById("new-character-span").classList.remove("hidden")
  })
}

function setUpCharacterList(characters) {
  characters.forEach(addCharacterToList)
}

function addCharacterToList(character) {
  ul = document.getElementById("character-list")
  const li = document.createElement('li')
  li.appendChild(createCharacterDeleteButton(character))
  li.appendChild(document.createTextNode(`${character.attributes.name}, Level: ${character.attributes.level}, HP: ${character.attributes.current_hp} / ${character.attributes.max_hp}`))
  li.appendChild(createPlayButton(character))
  ul.appendChild(li)
}

function createCharacterDeleteButton(character) {
  const deleteButton = document.createElement('button')
  deleteButton.addEventListener('click', e => {
    fetch(`${BASE_URL}/characters/${character.id}`, {
      method: 'DELETE',
      headers: HEADERS
    }).then(resp => {
      setToken.call(resp)
      const li = e.target.parentElement
      li.parentElement.removeChild(li)
    })
  })
  deleteButton.classList.add("delete")
  deleteButton.textContent = 'X'
  return deleteButton
}

function createPlayButton(character) {
  const playButton = document.createElement('button')
  playButton.addEventListener('click', e => {

  })
  playButton.textContent = `Play as ${character.attributes.name}`
  return playButton
}

function processNewCharacter(json) {
  addCharacterToList(json.data)
}

function setUpLogOutButton() {
  document.getElementById("logout-btn").addEventListener("click", () => {
    fetch(BASE_URL + "/users/sign_out", {
      method: 'DELETE',
      headers: HEADERS
    }).then(resp => {
      setToken.call(resp)
      removeCharactersFromList()
      switchDisplayElements()
    })
  })
}

function removeCharactersFromList() {
  document.getElementById("character-list").innerHTML = ''
}

class ActiveCharacter {
  constructor(character) {
    this._id = character.id
    this._name = character.attributes.name
    this._level = character.attributes.level
    this._current_hp = character.attributes.current_hp
    this._armor = character.attributes.armor
    this._weapon = character.attributes.weapon
    this._xp = character.attributes.xp
  }

  get name() {
    return this._name
  }

  get level() {
    return this._level
  }

  get currentHp() {
    return this._current_hp
  }

  get armor() {
    return this._armor
  }

  get weapon() {
    return this._weapon
  }

  get xp() {
    return this._xp
  }

  set currentHp(newHp) {
    this._current_hp = this._updateCharacter('current_hp', newHp)
  }

  gain_xp(xpGained) {
    this._xp = this._updateCharacter('xp', this._xp + xpGained)
  }

  _updateCharacter(fieldToUpdate, newValue) {
    const character = {}
    character[fieldToUpdate] = newValue
    fetch(BASE_URL + `/characters/${this._id}`, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify(character)
    })
      .then(resp => {
        setToken.call(resp)
        resp.json()
      })
      .then(json => {
        if (json.data) {
          return json.data.attributes[fieldToUpdate]
        } else {
          console.log(json)
          return this['_' + fieldToUpdate]
        }
      })
  }
}