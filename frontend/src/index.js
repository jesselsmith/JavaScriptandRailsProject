const BASE_URL = "http://localhost:3000"
const EXTERNAL_API_BASE = 'https://api.open5e.com/monsters'
let currentToken = ""
let activeCharacter
let activeMonster
const HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": currentToken
}

document.addEventListener("DOMContentLoaded", () => {
  setUpSignUpAndLogInButtons()
  setUpSignUpAndLoginForms()
  setUpLogOutButton()
  setUpExplorationButtons()
  setUpBattleButtons()
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
    const pcStats = document.getElementById('pc-stats')
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
      currentToken = ""
      removeCharactersFromList()
      switchDisplayElements()
    })
  })
}

function removeCharactersFromList() {
  document.getElementById("character-list").innerHTML = ''
}

function setUpExplorationButtons() {
  setUpFightEvilButton()
  setUpShortRestButton()
  setUpLongRestButton()
}

function setUpFightEvilButton() {
  fightEvil = document.getElementById('fight-evil')
  fightEvil.addEventListener('click', e => {
    activeCharacter.fightEvil()
    document.getElementById('exploration-buttons').classList.add('hidden')
    document.getElementById('battle-buttons').classList.remove('hidden')
    document.getElementById('monster-stats').classList.remove('hidden')
  })
}

function setUpShortRestButton() {

}
function setUpLongRestButton() {

}

function setUpBattleButtons() {
  setUpAttackButton()
  setUpFleeButton()
  setUpSecondWindButton()
}

function setUpAttackButton() {
  attackButton = document.getElementById('attack')
  attackButton.addEventListener('click', e => {
    activeCharacter.attack(activeMonster)
  })
}

function setUpFleeButton() {

}

function setUpSecondWindButton() {

}

function addGameEvent(text) {
  gameEventDisplay = document.getElementById('game-event-display')
  newEvent = document.createElement('p')
  newEvent.textContent = text
  gameEventDisplay.insertBefore(newEvent, gameEventDisplay.firstChild)
}

function rollDie(dieSize) {
  return Math.floor(Math.random() * dieSize) + 1
}

function advantageRoll(advantage) {
  let rollResult = rollDie(20)
  if (advantage === 'advantage') {
    rollResult = Math.max(rollResult, rollDie(20))
  } else if (advantage === 'disadvantage') {
    rollResult = Math.min(rollResult, rollDie(20))
  }
  return rollResult
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
    this._appropriate_crs_to_fight = character.attributes.appropriate_crs_to_fight
    this._gold = parseFloat(character.attributes.gold)
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

  get gold() {
    return this._gold
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

  set gold(newGoldAmount) {
    this._updateCharacter({ 'gold': newGoldAmount })
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
        damageRange[0] += 1
        damageRange[1] += 12
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

  get appropriate_crs_to_fight() {
    return this._appropriate_crs_to_fight
  }

  attack(monster, advantage = 'straight') {
    for (let i = 0; i < this.numAttacks; i++) {
      const dieRoll = advantageRoll(advantage)
      const attackRoll = this.attackBonus + dieRoll
      if (dieRoll === 20) {
        const critDamage = this.damageRoll + this.damageRoll - this.strengthBonus
        monster.currentHp = monster.currentHp - critDamage
        addGameEvent(`${this._name} critically hit ${monster.name} with their ${this._weapon} for ${damage} damage!!`)
      }
      else if (dieRoll === 1) {
        addGameEvent(`${this._name}'s attack critically missed ${monster.name}!`)
      }
      else if (attackRoll >= monster.armorClass) {
        const damage = this.damageRoll
        monster.currentHp = monster.currentHp - damage
        addGameEvent(`${this._name} hit ${monster.name} with their ${this._weapon} for ${damage} damage.`)
      } else {
        addGameEvent(`${this._name}'s attack missed ${monster.name}.`)
      }
    }
    monster.displayStats()
    if (monster.currentHp > 0) {
      monster.attack(this)
    }
  }

  get numAttacks() {
    if (this._level === 20) {
      return 4
    } else if (this._level >= 11) {
      return 3
    } else if (this._level >= 5) {
      return 2
    } else {
      return 1
    }
  }

  displayStats() {
    let statDisplay = document.getElementById(`${this.name}-stats`)
    if (!statDisplay) {
      statDisplay = document.createElement('div')
      statDisplay.setAttribute('id', `${this.name}-stats`)
    }
    statDisplay.textContent = `${this.name}, Level: ${this.level}, HP: ${this.currentHp} / ${this.maxHp}, Gold: ${this.gold}`
    return statDisplay
  }

  displayDetailedStats() {
    return `Attack Bonus: +${this.attackBonus}, Damage: ${this.damageRange}, Armor Class: ${this.armorClass}`
  }

  createMonsterFromResult = (monsterList, monsterSelection) => {
    new ActiveMonster({
      source: `${EXTERNAL_API_BASE}/${monsterList.results[monsterSelection].slug}`,
      callback: newMonster => {
        activeMonster = newMonster
        addGameEvent(`You have encountered ${activeMonster.name}!`)
        const monsterStats = document.getElementById('monster-stats')
        monsterStats.appendChild(activeMonster.displayStats())
        if (rollDie(2) - 1) {
          addGameEvent(`${activeMonster.name} got the jump on ${activeCharacter.name}!`)
          activeMonster.attack(activeCharacter)
        }
      }
    })
  }
  createMonsterFromList = (monsterList) => {
    let monsterSelection = rollDie(parseInt(monsterList.count)) - 1
    if (monsterSelection > 50) {
      const page = Math.ceil((monsterSelection + 1) / 50)
      monsterSelection = monsterSelection % 50
      monsterList = this.fetchMonsterList(`${monsterList.next.split('&')[0]}&page=${page}`).then(json => {
        this.createMonsterFromResult(json, monsterSelection)
      })
    } else {
      this.createMonsterFromResult(monsterList, monsterSelection)
    }
  }

  fightEvil() {
    const difficulty = Math.floor(Math.random() * 4)
    // 25% chance of easy battle, 50% chance of medium battle, 25% chance of hard battle
    const crToFight = this.appropriate_crs_to_fight[Math.ceil(difficulty / 2)]
    this.fetchMonsterList(crToFight).then(this.createMonsterFromList)
  }

  async fetchMonsterList(crAndOrPageNumber) {
    const resp = await fetch(EXTERNAL_API_BASE + `/?challenge_rating=${crAndOrPageNumber}`)
    return await resp.json()
  }

  _updateCharacter(objectForUpdating) {
    const character = {
      character: objectForUpdating
    }
    fetch(BASE_URL + `/characters/${this._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": currentToken
      },
      body: JSON.stringify(character)
    })
      .then(resp => {
        setToken.call(resp)
        return resp.json()
      })
      .then(json => {
        if (json && json.data) {
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
            if ('callback' in args) {
              args.callback(this)
            }
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
    this._gold = parseFloat(monster.gold)
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

  get gold() {
    return this._gold
  }

  set currentHp(newHp) {
    this._updateMonster({
      update: { 'current_hp': newHp },
      callback: () => {
        if (this._current_hp <= 0) {
          this.dies()
        }
      }
    })
  }

  dies() {
    addGameEvent(`${this._name} has been defeated!`)
    activeCharacter.gainXp(this._xp_granted)
    activeCharacter.gold = activeCharacter.gold + this.gold
    addGameEvent(`${activeCharacter.name} finds ${this.gold}gp!`)
  }

  displayStats() {
    let statDisplay = document.getElementById(`${this.name}-stats`)
    if (!statDisplay) {
      statDisplay = document.createElement('div')
      statDisplay.setAttribute('id', `${this.name}-stats`)
    }
    statDisplay.textContent = `${this.name}, HP: ${Math.round(this.currentHp / this.maxHp * 100)}%`
    return statDisplay
  }

  attack(character, advantage = 'straight') {
    const dieRoll = advantageRoll(advantage)
    const attackRoll = this.attackBonus + dieRoll
    if (dieRoll === 20) {
      character.currentHp = character.currentHp - (2 * this.damage)
      addGameEvent(`${this._name} critically hit ${character.name} for ${2 * this.damage} damage!!`)
    }
    else if (dieRoll === 1) {
      addGameEvent(`${this._name}'s attack critically missed ${character.name}!`)
    }
    else if (attackRoll >= character.armorClass) {
      character.currentHp = character.currentHp - this.damage
      addGameEvent(`${this._name} hit ${character.name} for ${this.damage} damage.`)
    } else {
      addGameEvent(`${this._name}'s attack missed ${character.name}.`)
    }
    character.displayStats()
  }
  _updateMonster(updateObject) {
    const monster = { monster: updateObject.update }
    fetch(BASE_URL + `/monsters/${this._id}`, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify(monster)
    })
      .then(resp => {
        setToken.call(resp)
        return resp.json()
      })
      .then(json => {
        if (json && json.data) {
          Object.keys(updateObject.update).forEach(key => {
            this['_' + key] = json.data.attributes[key]
          })
          if ('callback' in updateObject) {
            updateObject.callback()
          }
          this.displayStats()
        } else {
          console.log(json)
        }
      })
  }

}
