Rails.application.routes.draw do
  resources :monsters
  resources :characters, only: [:index, :show, :create, :update, :destroy]
  devise_for :users
  root 'home#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
