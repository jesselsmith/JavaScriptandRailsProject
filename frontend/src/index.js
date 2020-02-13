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
    //hide login and sign up buttons and forms while logged in
    hideButtonsAndForms()
    //show text welcoming user and logout button while logged in
    document.getElementById('logged-in-span').classList.remove("hidden")
    //show new character button
    setUpNewCharacterButton()
    document.getElementById("new-character").classList.remove("hidden")
    //prepare and display list of user's characters
    setUpCharacterList(json.included)
    document.getElementById("character-list-div").classList.remove("hidden")
  } else {
    console.log(json)
  }
}

function switchButtonsAndForms() {
  const buttons = document.getElementById("new-session-btns")
  if (buttons.classList.includes("hidden")) {
    buttons.classList.remove("hidden")
    document.getElementById("signup-div").classList.remove("hidden")
    document.getElementById("login-div").classList.remove("hidden")
  } else {
    buttons.classList.add("hidden")
    document.getElementById("signup-div").classList.add("hidden")
    document.getElementById("login-div").classList.add("hidden")
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
  li = document.createElement('li')
  li.textContent = `${character.attributes.name} Level: ${character.attributes.level} HP: ${character.attributes.current_hp} / ${character.attributes.max_hp}`
  ul.appendChild(li)
}

function processNewCharacter(json) {
  addCharacterToList(json.data)
}

function setUpLogOutButton() {
  document.getElementById("logout-btn").addEventListener("click", e => {
    fetch(BASE_URL + "/users/sign_out", {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": currentToken
      }
    }).then(resp => {
      setToken.call(resp)
      return resp.json()
    }).then(json => {

    }
    )
  })
}