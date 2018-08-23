Readme

Our app allows users to login and read most updated news from many well known sources, such
as CNN, ESPN, BBC News etc.

By this checkpoint, here are the features that we have:
1. Sign up including error case handling.
2. Sign in including error case handling.
3. Update personal information including error case handling.
4. Read news on main page including real-time infinite scroll-down to load more news.
5. Click on an article title will be linked to the news source webpage.
6. Click on an article image will open a modal and load the webpage within the app.
7. Click on "Manage Subscription" will show a modal containing available sources (6 news sources so far).
8. DB contains three main tables, Users, Articles, and Sources, and two join tables.
9. Press the getJSON button on the main page, which will add the most updated news from the sources to the database, and reload the page.
10. UI improvement on multiple areas, including login, main page, modals, along with some added animations.
11. Search functionality in user feed as well as in user-favourite page

---------------------------------------------------------------
Final Implementation Info:
1.After the checkpoint, we have included more practical and comprehensive features including the commenting system, favorite(like) and unfavorite(unlike) a specific news, and UI animation improvements to make our app more mobile-oriented.
2. Here are a list of the features of our app with more details:
3. Sign In/Sign up with passportJS and particle effect show in the background
4. Update Personal Information in Settings page
5. Main layout design with Materialize mobile design
6. Infinite Scroll of news with SamsungGrid animation
7. User can like/favorite a certain feature, and can always go to the Favorite tab in a later time to review the news the user has liked
8. The news that a user has liked before will always show the “red heart” icon to indicate that this article has been liked before
9. User can unfavorite an article in the favorite list with real-time deletion
10. In main page, if logging in as admin, then you will see a “Get Feed” button that is used for getting the latests news from all available sources. This button is not visible for other users
At the bottom-right corner, you will see a filter icon, which allows users to filter by news sources, and only get news feed from the selected sources
11. News are sorted where latest news are on top
12. Clicking into an article will see an embedded page, including a short description of the news
13 .Users can click on-site review to check the news website embedded in our app
14. In the news page, we have a real-time commenting system, where users can comment on the article, and interact with other users(reply feature included). Users can also edit their comments. 15. Our real-time feature allows users to see the new comments added immediately.
16. In terms of testing, please try playing around with the Bar user or sign up with a new user. Admin user is only used to make sure latest news json are received, so that other users can see the latest news.




Login info:
Admin Username: admin
Password: 123
Another Username: Bar
Password:456

Or Sign up with a new account

To run the app

Please execute the command: vagrant up
Then go to http://localhost:8080/ to access the website
Login as Bar (pswd:456) and click bottom-right corner filter icon to select the sources you want to subscribe, then you should be able to see the news feed.




The third party libraries and technology we use include:
External Library:
animatedModal.js http://joaopereirawd.github.io/animatedModal.js/
Masonry http://masonry.desandro.com/
SamsungGrid: https://github.com/codrops/SamsungGrid
ParticleJS: https://github.com/VincentGarreau/particles.js/
Materialize CSS: http://materializecss.com/
Bootstrap: http://getbootstrap.com/

NPM Module:
Cartoon-avatar
Passport
Passport-http
Passport-local
Express-handlebars
Express-messages
Connect-flash
Express-passport
Express-session
bcryptjs
Socket.io
Validator
 mysql(MySQL)
Image:
   Various source icons from google
API used:
https://newsapi.org/


******Special Note*****
Normally, Vagrant should be working.
However:
If your vagrant up isn't working, it is probably because your vagrant version is too new.  Try appending this ", host_ip: "127.0.0.1" after " config.vm.network "forwarded_port", guest: 80, host: 8080" in Vagrant file, so that it will look like this " config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"


