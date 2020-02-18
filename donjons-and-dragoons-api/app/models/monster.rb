class Monster < ApplicationRecord
  
  belongs_to :character
  validates :name, uniqueness: true

  def self.new_monster_from_api(api_monster)
    monster_hash = {}
    monster_hash[:species] = api_monster[:name]
    monster_hash[:name] = "#{Faker::Games::ElderScrolls.first_name} the #{monster_hash[:species]}"
    monster_hash[:source] = "http://www.dnd5eapi.co/api/monsters/#{api_monster[:slug]}" 
    monster_hash[:max_hp] = api_monster[:hit_points]
    monster_hash[:current_hp] = monster_hash[:max_hp]
    monster_hash[:xp_granted] = challenge_rating_to_xp_granted(api_monster[:challenge_rating])
    monster_hash[:armor_class] = api_monster[:armor_class]
    attack = attack_from_actions(api_monster[:actions])
    monster_hash[:attack_bonus] = attack[:attack_bonus] || 0
    monster_hash[:damage] = damage_from_attack(attack)
    monster_hash[:gold] = Monster.treasure(monster_hash[:xp_granted])
    Monster.new(monster_hash)
  end

  def self.challenge_rating_to_xp_granted(cr)
    case cr
    when '0'
      10
    when '1/8'
      25
    when '1/4'
      50
    when '1/2'
      100
    when '1'
      200
    when '2'
      450
    when '3'
      700
    when '4'
      1100
    when '5'
      1800
    when '6'
      2300
    when '7'
      2900
    when '8'
      3900
    when '9'
      5000
    when '10'
      5900
    when '11'
      7200
    when '12'
      8400
    when '13'
      10_000
    when '14'
      11_500
    when '15'
      13_000
    when '16'
      15_000
    when '17'
      18_000
    when '18'
      20_000
    when '19'
      22_000
    when '20'
      25_000
    when '21'
      33_000
    when '22'
      41_000
    when '23'
      50_000
    when '24'
      62_000
    when '25'
      75_000
    when '26'
      90_000
    when '27'
      105_000
    when '28'
      120_000
    when '29'
      135_000
    when '30'
      155_000
    else
      0
    end
  end

  def self.attack_from_actions(actions)
    attacks = actions.select  { |action| action.has_key? 'attack_bonus'}
    attacks.max_by { |attack| [attack[:attack_bonus], damage_from_attack(attack)] } || {attack_bonus: 0, desc: 'Hit: 0'}
  end

  def self.damage_from_attack(attack)
    attack[:desc].split('Hit: ')[1].split(' ').first.to_i
  end

  def self.treasure(xp_granted)
    treasure_array = [
      {
        xp_cutoff: 1100,
        treasure_table: [
          { upper_limit: 30, treasure: 0.17 },
          { upper_limit: 60, treasure: 1.4 },
          { upper_limit: 70, treasure: 5 },
          { upper_limit: 95, treasure: 10 },
          { upper_limit: 100, treasure: 30 }
        ]
      },
      {
        xp_cutoff: 5900,
        treasure_table: [
          { upper_limit: 30, treasure: 31.5 },
          { upper_limit: 60, treasure: 91 },
          { upper_limit: 70, treasure: 245 },
          { upper_limit: 95, treasure: 140 },
          { upper_limit: 100, treasure: 170 }
        ]
      },
      {
        xp_cutoff: 15_000,
        treasure_table: [
          { upper_limit: 20, treasure: 175},
          { upper_limit: 35, treasure: 525 },
          { upper_limit: 75, treasure: 1050 },
          { upper_limit: 100, treasure: 1400 }
        ]
      },
      {
        xp_cutoff: Float::INFINITY,
        treasure_table: [
          { upper_limit: 15, treasure: 6300},
          { upper_limit: 55, treasure: 7000 },
          { upper_limit: 100, treasure: 10_500 }
        ]
      }
    ]

    treasure_hash = treasure_array.find do |treasure_table_hash|
      treasure_table_hash[:xp_cutoff] >= xp_granted
    end
    d100_roll = rand(1..100)
    treasure_amount = treasure_hash[:treasure_table].find do |treasure_entry|
      d100_roll <= treasure_entry[:upper_limit]
    end
    treasure_amount[:treasure]
  end
end
