const BASE_URL = "http://localhost:3000"
const EXTERNAL_API_BASE = 'https://api.open5e.com/monsters'
let currentToken = ""
let activeCharacter
let activeMonster
const HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
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
    document.getElementById('character-menu').classList.add('hidden')
    document.getElementById('game-summary').classList.add("hidden")
    document.getElementById('gameplay-area').classList.remove('hidden')
    document.getElementById('exploration-buttons').classList.remove('hidden')
    activeCharacter = new ActiveCharacter(character)
    pcStats = document.getElementById('pc-stats')
    pcStats.appendChild(activeCharacter.displayStats())
  })
  playButton.textContent = `Play as ${character.attributes.name}, Level: ${character.attributes.level}, HP: ${character.attributes.current_hp} / ${character.attributes.max_hp}`
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
  newEvent = document.createElement('p')
  newEvent.textContent = text
  gameEventDisplay.insertBefore(newEvent, gameEventDisplay.firstChild)
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
    this._appropriate_crs_to_fight = character.attributes._appropriate_crs_to_fight
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
    this._updateCharacter({ 'current_hp': newHp })
  }

  set armor(newArmor) {
    this._updateCharacter({ 'armor': newArmor })
  }

  set weapon(newWeapon) {
    this._updateCharacter({ 'weapon': newWeapon })
  }

  gainXp(xpGained) {
    const updateObject = { 'xp': this._xp + xpGained }
    const xpTable = [300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 14000, 165000, 195000, 225000, 265000, 305000, 355000]
    const newLevel = xpTable.findIndex(element => element > updateObject.xp) + 1
    addGameEvent(`${this._name} gained ${xpGained} experience points.`)
    if (newLevel !== this._level) {
      updateObject['level'] = newLevel
      updateObject['current_hp'] = this._current_hp + 9 * (newLevel - this._level)
      addGameEvent(`${this._name} is now level ${newLevel}!`)
    }
    this._updateCharacter(updateObject)
  }

  static rollDie(dieSize) {
    return Math.floor(Math.random() * dieSize) + 1
  }

  get maxHp() {
    return this.level * 9 + 4
  }

  get proficiency() {
    return Math.ceil(this._level / 4) + 1
  }

  get attackBonus() {
    return this.proficiency + this.strengthBonus
  }


  get strengthBonus() {
    if (this._level >= 6) {
      return 5
    } else if (this._level >= 4) {
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

  get damageRange() {
    let damageRange = [this.strengthBonus + 1, this.strengthBonus]
    switch (this._weapon) {
      case 'shortsword':
        damageRange[1] += 6
        break
      case 'longsword':
        damageRange[1] += 8
        break
      case 'halberd':
        damageRange[1] += 10
        break
      case 'lance':
        damageRange[1] += 12
        break
      case 'greatsword':
        damageRange[0] += 2
        damageRange[0] += 12
        break
      default:
        damageRange[1] += 1
    }
    return `${damageRange[0]} - ${damageRange[1]}`
  }

  get damageRoll() {
    let damageRoll = this.strengthBonus
    switch (this._weapon) {
      case 'shortsword':
        damageRoll += ActiveCharacter.rollDie(6)
        break
      case 'longsword':
        damageRoll += ActiveCharacter.rollDie(8)
        break
      case 'halberd':
        damageRoll += ActiveCharacter.rollDie(10)
        break
      case 'lance':
        damageRoll += ActiveCharacter.rollDie(12)
        break
      case 'greatsword':
        damageRoll += ActiveCharacter.rollDie(6) + ActiveCharacter.rollDie(6)
        break
      default:
        damageRoll += 1
    }
    return damageRoll
  }

  advantageRoll(advantage) {
    let rollResult = ActiveCharacter.rollDie(20)
    if (advantage === 'advantage') {
      rollResult = Math.max(rollResult, ActiveCharacter.rollDie(20))
    } else if (advantage === 'disadvantage') {
      rollResult = Math.min(rollResult, ActiveCharacter.rollDie(20))
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

  displayStats() {
    let statDisplay = document.getElementById(`${this.name}-stats`)
    if (!statDisplay) {
      statDisplay = document.createElement('div')
      statDisplay.setAttribute('id', `${this.name}-stats`)
    }
    statDisplay.textContent = `${activeCharacter.name}, Level: ${activeCharacter.level}, HP: ${activeCharacter.currentHp} / ${activeCharacter.maxHp}`
    return statDisplay
  }

  displayDetailedStats() {
    return `Attack Bonus: +${activeCharacter.attackBonus}, Damage: ${activeCharacter.damageRange}, Armor Class: ${activeCharacter.armorClass}`
  }

  _updateCharacter(objectForUpdating) {
    const character = {
      character: objectForUpdating
    }
    fetch(BASE_URL + `/characters/${this._id}`, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify(character)
    })
      .then(resp => {
        setToken.call(resp)
        return resp.json()
      })
      .then(json => {
        if (json.data) {
          Object.keys(objectForUpdating).forEach(key => {
            this['_' + key] = json.data.attributes[key]
          })
          if ('level' in objectForUpdating) {
            this._appropriate_crs_to_fight = json.data.attributes.appropriate_crs_to_fight
          }
          this.displayStats()
        } else {
          console.log(json)
        }
      })
  }
}

class ActiveMonster {
  constructor(args) {
    if ('source' in args) {
      const monster_hash = {
        monster: {
          'name': '',
          'type': '',
          'slug': '',
          'hit_points': '',
          'challenge_rating': '',
          'armor_class': '',
          'actions': []
        }
      }
      fetch(args.source, { method: "GET" }).then(resp => resp.json()).then(json => {
        Object.keys(monster_hash.monster).forEach(key => monster_hash.monster[key] = json[key])
      }).then(() => {
        fetchPoster(BASE_URL + '/monsters', monster_hash, true).then(json => {
          if (json.data) {
            this._update_from_json(json)
          } else {
            console.log(json)
          }
        })
      })
    } else if ('json' in args) {
      this._update_from_json(args.json)
    }
  }

  _update_from_json(json) {
    this._id = json.data.id
    const monster = json.data.attributes
    this._name = monster.name
    this._species = monster.species
    this._source = monster.source
    this._current_hp = monster.current_hp
    this._max_hp = monster.max_hp
    this._xp_granted = monster.xp_granted
    this._armor_class = monster.armor_class
    this._attack_bonus = monster.attack_bonus
    this._damage = monster.damage
  }

  get name() {
    return this._name
  }

  get species() {
    return this._species
  }

  get currentHp() {
    return this._current_hp
  }

  get maxHp() {
    return this._max_hp
  }

  get xpGranted() {
    return this._xp_granted
  }

  get armorClass() {
    return this._armor_class
  }

  get attackBonus() {
    return this._attack_bonus
  }

  get damage() {
    return this._damage
  }

  set currentHp(newHp) {
    this._current_hp = this._updateMonster('current_hp', newHp)
  }
  _updateMonster(fieldToUpdate, newValue) {
    const monster = { monster: {} }
    monster['monster'][fieldToUpdate] = newValue
    fetch(BASE_URL + `/monsters/${this._id}`, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify(monster)
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
