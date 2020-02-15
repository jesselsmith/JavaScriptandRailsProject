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
      headers: {
        "Accept": "application/json",
        "Authorization": currentToken
      }
    }).then(resp => {
      setToken.call(resp)
      const li = e.target.parentElement
      li.parentElement.removeChild(li)
      return resp.json()
    }).then(json => console.log(json))
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

function addGameEvent(text) {
  gameEventDisplay = document.getElementById('game-event-display')
  gameEventDisplay.textContent = text + gameEventDisplay.textContent
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

  set armor(newArmor) {
    this.armor = this._updateCharacter('armor', newArmor)
  }

  set weapon(newWeapon) {
    this.weapon = this._updateCharacter('weapon', newWeapon)
  }

  gain_xp(xpGained) {
    this._xp = this._updateCharacter('xp', this._xp + xpGained)
  }

  static rollDie(dieSize) {
    return Math.floor(Math.random() * dieSize) + 1
  }

  get max_hp() {
    4 + this._level * 9
  }

  get proficiency() {
    Math.ceiling(this._level / 4) + 1
  }

  get attackBonus() {
    return this.proficiency + this.strengthBonus
  }


  get strengthBonus() {
    if (this._level >= 6) {
      return 5
    } else if (this.level >= 4) {
      return 4
    } else {
      return 3
    }
  }

  get armorClass() {
    switch (this._armor) {
      case 'chain mail':
        return 16
      case 'splint mail':
        return 17
      case 'plate mail':
        return 18
    }
  }

  get damageRoll() {
    let damageRoll = this.strengthBonus
    switch (this._weapon) {
      case 'shortsword':
        damageRoll += rollDie(6)
        break
      case 'longsword':
        damageRoll += rollDie(8)
        break
      case 'halberd':
        damageRoll += rollDie(10)
        break
      case 'lance':
        damageRoll += rollDie(12)
        break
      case 'greatsword':
        damageRoll += rollDie(6) + rollDie(6)
        break
      default:
        damageRoll += 1
    }
    return damageRoll
  }

  advantageRoll(advantage) {
    let rollResult = rollDie(20)
    if (advantage === 'advantage') {
      rollResult = Math.max(rollResult, rollDie(20))
    } else if (advantage === 'disadvantage') {
      rollResult = Math.min(rollResult, rollDie(20))
    }
    return rollResult
  }

  attack(monster, advantage = 'straight') {
    const dieRoll = this.advantageRoll(advantage)
    const attackRoll = this.attackBonus + dieRoll
    if (dieRoll === 20) {
      const critDamage = this.damageRoll + this.damageRoll - this.strengthBonus
      monster.currentHp -= critDamage
      addGameEvent(`${this._name} critically hit ${monster.name} with their ${this._weapon} for ${damage} damage!!`)
    }
    else if (dieRoll === 1) {
      addGameEvent(`${this._name}'s attack critically missed ${monster.name}!`)
    }
    else if (attackRoll >= monster.armorClass) {
      const damage = this.damageRoll
      monster.currentHp -= damage
      addGameEvent(`${this._name} hit ${monster.name} with their ${this._weapon} for ${damage} damage.`)
    } else {
      addGameEvent(`${this._name}'s attack missed ${monster.name}.`)
    }
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

class ActiveMonster {
  constructor(source) {
    fetch(source, { method: "GET" }).then(resp => resp.json()).then(json => {
      this._type = json.name
      this._name = `${fetch('http://faker.hook.io/?property=name.firstName', { method: "GET" }).then(resp => resp.json()).then(name => name)} the ${this._type}`

    })
  }
}

{
  "_id": "5e47666a0b1bb138c516c02b",
    "index": "goblin",
      "name": "Goblin",
        "size": "Small",
          "type": "humanoid",
            "subtype": "goblinoid",
              "alignment": "neutral evil",
                "armor_class": 15,
                  "hit_points": 7,
                    "hit_dice": "2d6",
                      "speed": { "walk": "30 ft." },
  "strength": 8,
    "dexterity": 14,
      "constitution": 10,
        "intelligence": 10,
          "wisdom": 8,
            "charisma": 8,
              "proficiencies": [{
                "name": "Skill: Stealth",
                "url": "/api/proficiencies/skill-stealth",
                "value": 6
              }],
                "damage_vulnerabilities": [],
                  "damage_resistances": [],
                    "damage_immunities": [],
                      "condition_immunities": [],
                        "senses": {
    "darkvision": "60 ft.",
      "passive_perception": 9
  },
  "languages": "Common, 
  Goblin", 
  "challenge_rating": 0.25,
    "special_abilities": [{
      "name": "Nimble Escape",
      "desc": "The goblin can take the Disengage or Hide action as a bonus action on each of its turns."
    }],
      "actions": [
        {
          "name": "Scimitar",
          "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.",
          "attack_bonus": 4,
          "damage": [{
            "damage_type": {
              "name": "Slashing",
              "url": "/api/damage-types/slashing"
            },
            "damage_dice": "1d6",
            "damage_bonus": 2
          }]
        },
        {
          "name": "Shortbow",
          "desc": "Ranged Weapon Attack: +4 to hit, 
range 80/320 ft., 
one target.Hit: 5(1d6 + 2) piercing damage.", 
"attack_bonus": 4,
        "damage": [{
          "damage_type": {
            "name": "Piercing",
            "url": "/api/damage-types/piercing"
          },
          "damage_dice": "1d6",
          "damage_bonus": 2
        }] }],
"url": "/api/monsters/goblin" }