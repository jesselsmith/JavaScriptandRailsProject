class Character < ApplicationRecord
  belongs_to :user

  def max_hp()
    self.level * 9 + 4 if self.level
  end
end
