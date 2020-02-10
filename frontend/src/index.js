const BASE_URL = "http://localhost:3000"


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-btn").addEventListener("click", e => {
    document.getElementById("signup-div").classList.add("hidden")
    document.getElementById("login-div").classList.remove("hidden")
  })
  document.getElementById("signup-btn").addEventListener("click", e => {
    document.getElementById("login-div").classList.add("hidden")
    document.getElementById("signup-div").classList.remove("hidden")
  })
})

