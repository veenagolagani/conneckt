Connekt-A professional networking app
This is a platform similar to linkedIn where people can connect to everyone for a better purpose of professional scope

NOTE:

Every authentication,retrival,sending the data,updation is made using the json server and the endpoints created through it
I've attached all the files in the folder that are required for the application to run

Make sure to start the server before running the files.

IF at any place it says failed to fetch....stop server using ctrl+c and start server again.

Steps to start the json server:
1.MAke sure the terminal is changed to mock-api folder in the submission folder

>../..../...>cd mock-api
 It should look something like this after running the above utility
 >.../..../...mock-api>

2.Run the following command to start the json server

 >json-server --watch db.json --port 3000

3.Running the above command should result in something like this
Endpoints:
http://localhost:3000/users
http://localhost:3000/posts
http://localhost:3000/messages
http://localhost:3000/applications
http://localhost:3000/jobs
http://localhost:3000/notifications
http://localhost:3000/admins

4.Now the json server is listening on port 3000 .Now try to run the html file starting from index.html


This app deals with 2 users,admin and users
Lets see the features we have for each role

****USERS:
Users are provided with multipl pages providing multiple features
Not only the front end but also the backend is inculcated in the project using json server by using end APIs
Users can navigate to other pages through the navigation menu or hyperlinks anywhere in page and to the previous page using back button or similar in every page

NOTE:

login for registered users can be done if credentials match with those in the db.json
Go through db.json for existing user's credentials


1)LOGIN or SIGN UP/AUTHENTICATION:
-Users have to login with their registered email ID and password.If at all user forgets his/her own password there is an option "FOrget password" clicking on which another form is redirected to and takes details for recovering the account
-There is an option for new users wo do not have an account i.e to sign-up through the link provided below the login button,whick when clicked redirects to a page that has multiple slides of forms that collects data from the user and then they can sign up
-If admin wants to login,he can also click the link provided in same login page that edirects to admin login page.In general,admin login page is not found on users' UI but for our convenience and time being the admin login page redirection link is foun at bottom of login tab
-The authentication of user is dont through restAPI methods by checking the credentials through our db.json
-The profile card on the left has many redirecting texts/links like my profile,my network,edit profile.
-My profile hyperlink redirects to the profile page of the user,where he can see his profile details and the posts he made.He can also delete his posts or share the posts through a link by clicking on appropriate options below each post.He also can logout through his my profile page only
-edit profile hyperlink redirects to the profile editing page,where user can edit ones own profile picture,name,contact information etc. and save the details
-My network hyperlink redirects to the networks and connections page of a user

2)Feed page
-This is the landing page after login,to the left corner of this page a profile card of the logged in user is seen with many other pages' links.
-This page has the feed i.e. the posts of other users retrieved through json server(db.json),where the user can like the post and comment on it by typing the comment in message box and clicking on post(envelope icon).

3)Jobs page
-This is the job listings page,where user can see various job openings and can apply for them by clicking on APPLY NOW button which redirects to a form taking all the details from the user required for the application.
-On successfully applying for the job,a popup confirming the application can be seen.

4)Notifications page
-In this page,all the notifications for a user exists.
-A connect request can be accepted through this page or a notification from a comany cn be viewed through appropriate buttons

5)Connections page
-In this page,User can see all his connections and beside every connection name,he has an option to message,and clicking on which he is redirected to a chat page that allows them to have a conversation


***ADMIN***:
-Generally admin login is not directly made available on the users' UI but for now i've added it in user login itself.
-The user login ui has a hyperlink at bottom to login as admin,clicking on which it is redirected to admin login page
-Admin login page takes admin credentials like his mail,password and admin code and entering appropriate credentials admin can login.
-Admin can navigate to different pages through the navigation menu in the header of everypage and logout using the logout button to the top right corner of every page

1)Dashboard
-This is the admin landing page after login,that have data and data visualization regarding users,their posts,and their applications.It is basically the user activity visualization

2)Manage users
-This page allows the admin to view all the users,It allows them to search and filter users through search bar
-The admin can also export the users details using the export csv button beside search bar
-The users listing shows the username,email,number of posts,applications a user made,token count,account status and actions that has buttons to enable the admin to delete a profile,block a profile or unblock a profile
-The token is given to a user for anything inappropriate he posts.If the token count is more than three...account will be blocked.

3)Manage Jobs
-This is the job listings page where admin can view all the jobs listed in the app to the users.
-The admin can search for a job in this using the search/filters bar provided.
-An admin can manually add a new job to the listing,which will be updated in user jobs page,where user will be able to apply for it

4)Manage posts
-This page allows the admin to view the posts made by a user,the content of a post,likes the post got.
-The admin can delete a post,give a token or remove the token he have given to the post made by a user.
-The admin can search for a particular post using the ID of the post





