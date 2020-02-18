class Character < ApplicationRecord
  belongs_to :user
  has_one :monster, dependent: :destroy

  def max_hp()
    self.level * 9 + 4 if self.level
  end

  def appropriate_crs_to_fight()
    steps = ['0', '1/8', '1/4', '1/2']
    20.times do |i|
      steps << (i + 1).to_s
    end
    if(self.level <= 6)
      steps[(self.level - 1)..(self.level + 1)]
    elsif(self.level <= 10)
      steps[(self.level / 3 + 3)..(self.level/3 + 5)]
    elsif(self.level <= 16)
      steps[(self.level / 2 + 2)..(self.level/2 + 4)]
    else
      steps[(self.level - 6)..(self.level - 4)]
    end
  end
end
