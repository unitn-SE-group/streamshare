# StreamShare streaming platform
HOW TO DEMO: 
In order to correctly run the application, you need to start both the frontend and the backend, so make sure to open two terminals and run these two commands (one for each terminal):
npm run dev (<- frontend) | npm run devStart (<- backend)
Once both processes are running correctly, you should check the terminal in which you have ran the frontend as it should be providing you with a link to the application in localhost, namely: `http://localhost:5173/`, by ctrl + left clicking on it you should open a new page on your browser to see the application's frontend.
Once inside, what you should be looking at is the front page of our application, the working buttons (for now) are the following: the `Stream now` and `Watch` buttons, both of which directs you to the login webpage, since you have never registered, I suggest you click directly on the `Register` button, which will direct you to the registration webpage, otherwise you can click on the `google icon` button or the pop up notification in order to automatically register/login through google's system, you can also click on the `Home` or the `StreamShare logo` buttons to go back to the home page.
The Register page allows you to insert your credentials, make sure every field is filled, otherwise you will be notified which field is missing, once every field is inserted correctly, you can proceed to click the `Create account` button to register the new account in the database, other options are, again, to click the `Home` or `StreamShare logo` buttons to go back to the home page or to press the `Login` or `Watch` buttons to go back to the login page.
For now, after completing the login phase, you are redirected to an empty webpage which is supposed to be the role: `user` webpage (not yet implemented), the webpage currently working is the role: `admin` one which you cannot register for since we've decided it would be better if the admins' login informations were hard coded by the developers inside of the database, for this reason we will provide an email and password to access aforementioned page: email : `exampleadmin@gmail.com`, password : `adminadmin`. 
Once logged in as role: `admin` you will be redirected into the webpage `http://localhost:5173/admin-dashboard` in which you will see the list of uploaded videos, by hovering the cursor over any of the listed thumbnails, a button `Remove` will appear, by pressing it, the selected video will be deleted from the database and from the webpage, by scrolling down you will find another button `Upload content` which, if pressed,  ... once again, by pressing the `Watch` button you will be redirected to the login webpage, the `Home` or `StreamShare logo` buttons redirects you to the home page.
It is important to denote that every error is notified to the user with a small explanation on what went wrong and the error code.















