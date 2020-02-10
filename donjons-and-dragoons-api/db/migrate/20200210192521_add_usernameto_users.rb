class AddUsernametoUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :username, :string, after: 'email', null: false, default: ""
  end
end
