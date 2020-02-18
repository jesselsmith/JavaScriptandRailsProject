Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'sessions', registrations: 'registrations' }, defaults: { format: :json }
  resources :monsters, defaults: {format: :json}
  resources :characters, only: [:index, :show, :create, :update, :destroy], defaults: {format: :json}
  root 'home#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
