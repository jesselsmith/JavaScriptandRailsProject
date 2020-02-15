class Monster < ApplicationRecord

  def newMonster_from_api(api_monster)
    monster_hash = {}
    monster_hash[type] = api_monster[name]
    monster_hash[name] = "#{Faker::Games::ElderScrolls.first_name} the #{monster_hash[type]}"
    monster_hash[source] = "http://http://www.dnd5eapi.co/api/monsters/#{api_monster[index]}" 
    monster_hash[max_hp] = api_monster[hit_points]
    monster_hash[xp_granted] = challenge_rating_to_xp_granted(api_monster[challenge_rating])
    monster_hash[armor_class] = api_monster[armor_class]
    attack = attack_from_actions(api_monster[actions])
    monster_hash[to_hit_bonus] = attack[attack_bonus]
    monster_hash[damage] = damage_from_attack(attack)

    Monster.new(monster_hash)
  end

  def challenge_rating_to_xp_granted(cr)
    case cr
    when 0
      10
    when 0.125
      25
    when 0.25
      50
    when 0.5
      100
    when 1
      200
    when 2
      450
    when 3
      700
    when 4
      1100
    when 5
      1800
    when 6
      2300
    when 7
      2900
    when 8
      3900
    when 9
      5000
    when 10
      5900
    when 17
      18000
    else
      0
    end
  end

  def attack_from_actions(actions)
    attacks = actions.select  { |action| action.has_key? 'attack_bonus'}
    attacks.max { |attack_a, attack_b| attack_a[attack_bonus] <=> attack_b[attack_bonus]}
  end

  def damage_from_attack(attack)
    attack[desc].split('Hit: ')[1].split(' ').first.to_i
  end
end
