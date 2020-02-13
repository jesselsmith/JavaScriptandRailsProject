# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_02_07_215222) do

  create_table "characters", force: :cascade do |t|
    t.string "name"
    t.integer "level"
    t.integer "current_hp"
    t.string "armor"
    t.string "weapon"
    t.integer "xp"
    t.integer "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_characters_on_user_id"
  end

  create_table "monsters", force: :cascade do |t|
    t.string "name"
    t.string "type"
    t.string "source"
    t.integer "max_hp"
    t.integer "current_hp"
    t.integer "xp_granted"
    t.string "armor"
    t.string "weapon"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "characters", "users"
end
