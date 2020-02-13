const BASE_URL = "http://localhost:3000"
let currentToken = ""

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
    switchButtonsAndForms()
  } else {
    console.log(json)
  }
}

function switchButtonsAndForms() {
  switchLoggedOutButtonsAndForms()
  switchLoggedInButonsAndForms()
}

function switchLoggedOutButtonsAndForms() {
  const buttonsClassList = document.getElementById("new-session-btns").classList
  if (buttonsClassList.contains("hidden")) {
    buttonsClassList.remove("hidden")
  } else {
    buttonsClassList.add("hidden")
    document.getElementById("signup-div").classList.add("hidden")
    document.getElementById("login-div").classList.add("hidden")
  }
}

function switchLoggedInButonsAndForms() {
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
  li.textContent = `${character.attributes.name} Level: ${character.attributes.level} HP: ${character.attributes.current_hp} / ${character.attributes.max_hp}`
  li.appendChild(createCharacterDeleteButton(character))
  ul.appendChild(li)
}

function createCharacterDeleteButton(character) {
  const deleteButton = document.createElement('button')
  deleteButton.addEventListener('click', e => {
    fetch(`${BASE_URL}/characters/${character.id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": currentToken
      }
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

function processNewCharacter(json) {
  addCharacterToList(json.data)
}

function setUpLogOutButton() {
  document.getElementById("logout-btn").addEventListener("click", () => {
    fetch(BASE_URL + "/users/sign_out", {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": currentToken
      }
    }).then(resp => {
      setToken.call(resp)
      removeCharactersFromList()
      switchButtonsAndForms()
    })
  })
}

function removeCharactersFromList() {
  document.getElementById("character-list").innerHTML = ''
}