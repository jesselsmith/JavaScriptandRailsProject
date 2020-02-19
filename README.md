# Donjons and Dragoons!
In Donjons and Dragoons, you take on the role of a newly minted Dragoon--a warrior and soldier charged with keeping the kingdom safe. You are stationed in the main keep of a castle--also known as a donjon--that has been laid siege to by the forces of darkness. Go and do what you can to defend the Donjon as the never ending tide of evil bears down upon your home! Gain levels and loot so that you can defeat ever more powerful enemies! Can you gain enough power to defeat the ultimate evil?
Find out in Donjons and Dragoons!

# Setup and Installation
Clone the repo from Github or download the files, and navigate to the application folder in your terminal. Execute the following commands to set up the database and backend:
```
$ cd donjons-and-dragons-api
$ bundle install
$ rails db:migrate
$ rails s
```
This will set up the api for the backend of the application at http://localhost:3000

If it's not already there, create a .env file in the main directory, and also add .env to the .gitignore file.

Create a secret:
```
$ rails secret
```
It should generate a long sequence of numbers and letters. Copy that over to the .env file with ‘DEVISE_JWT_SECRET_KEY=’ in front, so that it looks something like this:
```
DEVISE_JWT_SECRET_KEY=a1cce9c68e572ebb6614ab058092570becbdaa0451788eae9445164cc56dc142a92c5eccabe2a7d01784ae758a3392410af839c7f116ab05199961a9820f3840
``
Dont use that one though!

To begin play, navigate back to the frontend directory of the application in the terminal (or in your file explorer):
```
$ cd ../frontend
```
After navigating to the frontend directory, use your preferred browser to open frontend/index.html. The application was only tested on Google Chrome, so that would be the best browser to use.

On mac:
```
$ open index.html
```
--or--
```
$ open -a "Google Chrome" index.html 
```
On linux:
```
$ google-chrome index.html
```
With the page open in your browser, you will have to create an account by clicking on the "Sign Up" button on the upper right. This will allow you to save your progress in the game!

Then make a new character, and you're ready to start your adventure!

# Contributer's Guide
## Raising an Issue to Encourage a Contribution
If you notice a problem with the project that you believe needs improvement but you're unable to make the change yourself, you should raise a Github issue containing a clear description of the problem. Include relevant snippets of the content and/or screenshots if applicable. Thanks!

## Submitting a Pull Request to Suggest an Improvement
If you see an opportunity for improvement and can make the change yourself go ahead and use a typical git workflow to make it happen:

* Fork this repository
* Make the change on your fork, with descriptive commits in standard format
* Open a Pull Request against this repo
I will review the changes and approve or comment on them in due course.

Adapted from Learn contributing guide.

# License

https://github.com/jesselsmith/RailsProject/blob/master/LICENSE
