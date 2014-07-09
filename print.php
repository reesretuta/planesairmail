<!doctype html>
<!--[if lt IE 7 ]> <html class="no-js ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--> <html class="no-js" lang="en"> <!--<![endif]-->

<head>

    <meta charset="UTF-8">
    <title>Airmail - PRINT</title>
    <link rel="stylesheet" type="text/css" href="css/app.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    
    <meta name="description" content="">
    <meta name="keywords" content="">
        
    <link rel="shortcut icon" href="/media/images/favicon.ico">
    
    <script type="text/javascript" src="/media/js/libs/modernizr-1.7.min.js"></script>
    <style type="text/css" media="screen">
    #response-bg {
        position: absolute;
        top: 0;
        left: 0;
 
        width: 100%;
        height: 100%;

        background: center center no-repeat;
        background-size: cover;
        background-color: white;

        display: none;
        
    }
    
    .dusty {
        background-image: url('assets/img/response_bg_dusty.jpg');
    }
    .cabbie {
        background-image: url('assets/img/response_bg_cabbie.jpg');
    }
    .dipper {
        background-image: url('assets/img/response_bg_dipper.jpg');
    }
    .windlifter {
        background-image: url('assets/img/response_bg_windlifter.jpg');
    }
    .team {
        background-image: url('assets/img/response_bg_team.jpg');
    }
    .bladeranger {
        background-image: url('assets/img/response_bg_blade.jpg');
    }
    </style>
</head>


<body>
    <?php
    $char = $_GET['char'];
    $greeting = $_GET['greeting'];
    $body = $_GET['body'];
    $sincerely = $_GET['sincerely'];
    $from = $_GET['from'];
    switch ($char) {
        case 'bladeranger':
            $char = '/assets/spritesheets/blade/Guide_BladeRanger_body_970x600_00000.png';
            $signature = '/assets/img/signatures/bladeranger.png';
        break;
        case 'cabbie':
            $char = '/assets/spritesheets/cabbie/Cabbie_00000.png';
            $signature = '/assets/img/signatures/cabbie.png';
        break;
        case 'dipper':
            $char = '/assets/spritesheets/dipper/Dipper_00000.png';
            $signature = '/assets/img/signatures/dipper.png';
        break;
        case 'dusty':
            $char = '/assets/spritesheets/dusty/Dusty_plane_00000.png';
            $signature = '/assets/img/signatures/dusty.png';
        break;
        case 'windlifter':
            $char = '/assets/spritesheets/windlifter/Guide_Windlifter_body_970x600_00000.png';
            $signature = '/assets/img/signatures/windlifter.png';
        break;
        default:
        die('invalid input');
        break;
    }
    ?>
    <div id="wrap">
        <div id="card-wrap">
            <img id="character" src="<?= $char ?>" />
            <img id="letter" src="/assets/img/response_letter_bg.jpg" />
            
            
            <div id="card-text">
                <div id="card-greeting"><?= $greeting ?></div>
                <div id="card-body"><?= $body ?></div>
                <div id="card-sincerely"><?= $sincerely ?></div>
                <div id="card-from"><img src="<?= $signature ?>" /></div>
            </div>
            
            
        </div>
    </div>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <style type="text/css">
        body{
            background-color:#fff;
        }
    
        #wrap{
            width:693px;
            margin:0 auto;
            padding-top:200px;
            overflow:hidden;
        }
        #card-wrap{
            
            position:relative;
            height:600px;
        }

        #letter{
            left:0;
            top:20px;
            position: absolute;
            z-index:-2;
        }
        
        #character{
            position: absolute;
            top: -205px;
            left: 124px;
            z-index: -1;
            width: 67%;
        }
        
        #card-text{
            width:644px;
            margin: 0 auto;
            padding-top:110px;
        }
        
        #card-greeting{
            font-size: 35px;
            margin-bottom: 15px;
        }
        
        #card-body{
            font-family: 'Helvetica';
            font-size: 15px;
            line-height: 18px;
            margin-bottom: 15px;
        }
        
        #card-sincerely{
            text-align: center;
        }
        
        #card-from{
            text-align: center;
            font-size: 35px;
        }
        
        
    </style>
</body>
</html>    