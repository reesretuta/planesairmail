<!DOCTYPE html>
<html>
<head>
    <title>Planes Airmail</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0,minimal-ui" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />

    <!-- OG TAGS-->
    <meta property="og:title" content="Planes Airmail"/>
    <meta property="og:type" content="video.movie"/>
    <meta property="og:url" content="http://planesairmail.com"/>
    <meta property="og:image" content="<?= $server; ?>assets/img/facebookLogo.png" name="thumb" />
    <!-- <link rel="shortcut icon" href="favicon.ico" type="image/icon"> -->
    <!-- <link rel="icon" href="favicon.ico" type="image/icon"> -->
    <meta property="og:site_name" content="Planes Airmail"/>
    <meta property="og:description" content="Help your kids send a letter to Dusty, Dipper, and the rest of the team!"/>

    <link rel="stylesheet" type="text/css" href="css/app.css" />

    <script>
        var ipAddress = '0.0.0.0.0';
    </script>
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

//        ga('create', 'UA-52699659-1', 'auto');
        // ga('create', 'UA-52699659-1', {
        //     'cookieDomain': 'none'
        // });

        // ga('send', 'pageview');
    </script>
</head>
<body>
    <script>(function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    </script>
    <script>
        window.fbAsyncInit = function() {
            FB.Event.subscribe('edge.create', function(targetUrl) {
                ga('send', 'social', 'facebook', 'like', targetUrl);
            });
            FB.Event.subscribe('edge.remove', function(targetUrl) {
                ga('send', 'social', 'facebook', 'unlike', targetUrl);
            });
            FB.Event.subscribe('message.send', function(targetUrl) {
                ga('send', 'social', 'facebook', 'send', targetUrl);
            });
        };
    </script>


    <div id="fb-root"></div>


    <div id="content" class="full-relative">
        <div class="mobile empty-space"></div>
        <div class="full-absolute">
            <div class="full-relative">

                <div id="mobile-backgrounds" class="mobile">
                    <div class="front"></div>
                    <div class="middle"></div>
                    <div class="back"></div>
                </div>
                <div id="mobile-characters" class="mobile full-absolute">
                    <div class="empty-space"></div>
                    <div class="full-absolute">
                        <div id="letterbg-ctr" class="mobile">
                            <div class="background"></div>
                        </div>

                        <div class="character dusty">
                            <div class="empty-space"></div>
                        </div>
                        <div class="character dusty2">
                            <div class="empty-space"></div>
                        </div>
                        <div class="character dusty3">
                            <div class="empty-space"></div>
                        </div>

                        <div class="character dipper">
                            <div class="empty-space"></div>
                        </div>
                        <div class="character bladeranger">
                            <div class="empty-space"></div>
                        </div>
                        <div class="character cabbie">
                            <div class="empty-space"></div>
                        </div>
                        <div class="character cabbie2">
                            <div class="empty-space"></div>
                        </div>
                        <div class="character windlifter">
                            <div class="empty-space"></div>
                        </div>


                        <div class="character parachuter1">
                            <div class="empty-space"></div>
                        </div>
                        <div class="character parachuter2">
                            <div class="empty-space"></div>
                        </div>
                        <div class="character parachuter3">
                            <div class="empty-space"></div>
                        </div>
                    </div>
                </div>

                <div id="response-bg"></div>
                <div id="passwordScreen">
                    <div class="content">
                        <form action="index.php">
                            <label>
                                Password: <input type="password" name="pwd">
                            </label>
                            <input type="submit">
                        </form>
                    </div>
                </div>

                <div id="assetLoader">
                    <div class="bar">
                        <div class="full-relative">
                            <div class="text"></div>
                        </div>
                    </div>
                    <div class="logo"></div>
                </div>

                <div id="header">
                    <div class="full-relative">
                        <div class="empty-space"></div>
                        <div class="header-content">
                            <div class="full-relative">
                                <div class="logo">
                                    <div class="empty-space"></div>
                                </div>
                                <div class="in-theaters"></div>
                                <div class="social clearfix">
                                    <div class="fb-like" data-href="https://www.facebook.com/DisneyPlanes" data-layout="button_count" data-width="450" data-action="like" data-show-faces="false" data-share="false"></div>
                                    <a href="http://www.fandango.com/planes:fire26rescue_170063/movietimes" class="showtimes">Find showtimes</a>
                                    <a href="https://www.youtube.com/watch?v=ibAxkCJfvC4" class="trailer">View Trailer</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div id="intro-view">
                    <div class="full-relative">
                        <div class="begin-screen">
                            <div class="line">Send a message to your favorite member</div>
                            <div class="line">of the piston peak air attack team and</div>
                            <div class="line">they'll send you back some airmail!</div>
                            <div class="all-text mobile">Send a message to your favorite member of the piston peak air attack team and they'll send you back some airmail!</div>
                            <a href="#" class="begin">
                                <div class="empty-space"></div>
                                <div class="text">Begin</div>
                            </a>
                        </div>
                    </div>
                </div>


                <div class="pages-ctn full-relative">
                    <div class="page-nav">
                        <a href="#" class="finish-send">
                            <div class="empty-space"></div>
                            <div class="text">Finish & send</div>
                        </a>
                        <a href="#" class="next">
                            <div class="empty-space"></div>
                            <div class="text">next</div>
                        </a>
                        <div class="skip">
                            <div class="empty-space"></div>
                            <a href="#" class="skip">
                                I would like to skip
                            </a>
                        </div>
                    </div>

                    <div class="name page">
                        <div class="full-relative">
                            <div class="input-wrapper">
                                <div class="full-relative">
                                    <div class="title">
                                        <div class="line">LET'S DIVE IN!<br/>TELL US YOUR FIRST NAME!</div>
                                    </div>
                                    <input type="text" name="name" class="name"/>
                                    <div class="placeholder">
                                        <div>My name is</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    
                </div>


                <div id="response" class="full-absolute">
                    <div id="card-wrap">
                        
                        <div id="card-greeting"></div>
                        <div id="card-body">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                        <div id="card-sincerely">

                        </div>
                        <div id="card-from">
                            <div class="empty-space"></div>
                        </div>
                        <a href="#" id="printversion"></a>
                        <a href="/" id="sendmore">
                            <div class="empty-space"></div>
                        </a>
                    </div>
                </div>



                <div id="footer">
                    <div class="full-relative">
                        <div class="empty-space"></div>
                        <div class="footer-content">
                            <div class="copyright">&copy;2014 DISNEY</div>
                            <div class="in-theaters mobile">
                                <div class="empty-space"></div>
                            </div>
                            <div class="counter clearfix">
                                <div class="dot">
                                    <div class="empty-space"></div>
                                    <div class="number full-absolute">1</div>
                                    <div class="fill full-absolute"></div>
                                </div>
                            </div>
                            <a href="#" class="volume">
                                <div class="empty-space"></div>
                                <div class="svg-ctr">
                                    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path style="opacity:0;" fill="#E62529" d="m 37.991813,22.751636 -3.083782,3.083783 c 1.588254,1.572528 2.571897,3.753462 2.571897,6.164853 0,2.410848 -0.983643,4.592324 -2.571897,6.16431 l 3.083782,3.083782 c 2.364757,-2.368011 3.82775,-5.637242 3.82775,-9.248093 0,-3.611392 -1.462993,-6.880083 -3.82775,-9.248636 z" />
                                            <path style="opacity:0;" fill="#E62529" d="m 50.496123,32 c 0,-6.005432 -2.440672,-11.440956 -6.383379,-15.369023 L 41.05987,19.68385 c 3.149937,3.15319 5.097703,7.506925 5.097703,12.31615 0,4.808682 -1.948309,9.162417 -5.097703,12.31615 l 3.052874,3.052873 C 48.055451,43.440956 50.496123,38.005431 50.496123,32 z" />
                                            <path style="opacity:0;" fill="#E62529" d="m 59.173768,32.000271 c 0,-8.402181 -3.412386,-16.006711 -8.925453,-21.505137 l -3.068057,3.068056 c 4.72843,4.713247 7.654417,11.233274 7.654417,18.437081 0,7.203264 -2.925987,13.723833 -7.654417,18.436538 l 3.068057,3.068057 c 5.513067,-5.497884 8.925453,-13.102957 8.925453,-21.504595 z" />
                                        </g>
                                    </svg>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>



<!----------------------------- Backbone Libraries ----------------------->
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>

<script src="js/lib/handlebars-v1.3.0.js"></script>
<script src="js/lib/underscore-min.js"></script>
<script src="js/lib/backbone-min.js"></script>

<!---------------------------- Animation Libraries ----------------------->
<script src="js/lib/pixi.js"></script>

<script src="js/lib/TweenLite.min.js"></script>
<script src="js/lib/TimelineMax.min.js"></script>
<script src="js/lib/CSSPlugin.min.js"></script>
<script src="js/lib/EasePack.min.js"></script>

<!----------------------------- Other Libraries ----------------------->
<script src="http://code.createjs.com/soundjs-0.5.2.min.js"></script>


<!-------------------------------- App Javascript ------------------------>
<script src="js/build/app.js"></script>

</html>