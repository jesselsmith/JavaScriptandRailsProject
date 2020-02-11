const BASE_URL = "http://localhost:3000"


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-btn").addEventListener("click", () => {
    document.getElementById("signup-div").classList.add("hidden")
    document.getElementById("login-div").classList.remove("hidden")
  })
  document.getElementById("signup-btn").addEventListener("click", () => {
    document.getElementById("login-div").classList.add("hidden")
    document.getElementById("signup-div").classList.remove("hidden")
  })

  document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault()
    loginInfo = {
      user: {
        "username": e.target.querySelector('[name="user[username]"').value,
        "password": e.target.querySelector('[name="user[password]"').value
      }
    }
    fetchPoster(BASE_URL + "/users/sign_in", loginInfo)
      .then(processLogin)
    e.target.reset()
  })

  document.getElementById("signup-form").addEventListener("submit", e => {
    e.preventDefault()
    signupInfo = {
      "user": {
        "email": e.target.querySelector("#user_email").value,
        "username": e.target.querySelector("#user_username").value,
        "password": e.target.querySelector("#user_password").value,
        "password_confirmation": e.target.querySelector("#user_password_confirmation").value
      }
    }
    fetchPoster(BASE_URL + "/users", signupInfo)
      .then(processLogin)
    e.reset()
  }, false)
})

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
    document.getElementById("new-session-btns").classList.add("hidden")
    document.getElementById("signup-div").classList.add("hidden")
    document.getElementById("login-div").classList.add("hidden")
    //show text welcoming user and logout button while logged in
    document.getElementById('logged-in-span').classList.remove("hidden")
  }
}
