const BASE_URL = "http://localhost:3000"


document.addEventListener("DOMContentLoaded", () => {
  setUpSignUpAndLogInButtons()
  setUpSignUpAndLoginForms()

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
      "username": e.target.querySelector("#user_username").value,
      "password": e.target.querySelector("#user_password").value,
      "password_confirmation": e.target.querySelector("#user_password_confirmation").value
    }
    debugger
    fetchPoster(BASE_URL + "/auth", signupInfo)
      .then(processLogin)
    e.target.reset()
  }, false)
}

function setUpLoginForm() {
  document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault()
    loginInfo = {
      "email": e.target.querySelector('[name="user[email]"').value,
      "password": e.target.querySelector('[name="user[password]"').value
    }
    fetchPoster(BASE_URL + "/auth/sign_in", loginInfo)
      .then(processLogin)
    e.target.reset()
  }, false)
}

async function fetchPoster(url, body) {
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(body)
  })
  return await resp.json()
}

function processLogin(json) {
  if (json.username) {
    document.getElementById("welcome-text").textContent = `Welcome, ${json.username}!`
    //hide login and sign up buttons and forms while logged in
    hideButtonsAndForms()
    //show text welcoming user and logout button while logged in
    document.getElementById('logged-in-span').classList.remove("hidden")
    //show new character button
    setUpNewCharacterButton()
    document.getElementById("new-character").classList.remove("hidden")
  }
}

function hideButtonsAndForms() {
  document.getElementById("new-session-btns").classList.add("hidden")
  document.getElementById("signup-div").classList.add("hidden")
  document.getElementById("login-div").classList.add("hidden")
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
      fetchPoster(BASE_URL + "/characters", newCharInfo)
        .then(processNewCharacter)
    }, false)
    document.getElementById("new-character-span").classList.remove("hidden")

  })
}

function processNewCharacter(json) {
  console.log(json)
}
